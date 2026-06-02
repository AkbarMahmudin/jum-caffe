import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './repositories/payment.repository';
import { ConfigService } from '@nestjs/config';
import { PaymentStatus } from '../common/enum/payment-status.enum';
import { Payment } from './entities/payment.entity';
import { QueryParamsDto } from './dto/query-params.dto';
import { PaymentProviderInterface } from '../common/interface/payment-provider.interface';
import { MidtransTransactionResponse } from '../common/provider/midtrans/midtrans.interface';
import { In } from 'typeorm';
import { PaymentLog } from './entities/payment-log.entity';
import { PAYMENT_SERVICE } from '@jum-caffe/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentEvent } from './event/payment.event';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('PaymentProviderInterface')
    private readonly paymentProvider: PaymentProviderInterface,
    private readonly paymentRepository: PaymentRepository,
    @Inject(PAYMENT_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const { orderId, attempt = 1, amount } = createPaymentDto;

    const providerOrderId =
      this.paymentProvider?.generateOrderId?.(orderId, attempt) || undefined;

    const snapCreated = await this.paymentProvider.createTransaction(
      providerOrderId ?? orderId,
      amount,
    );

    let payment: Payment;

    if (snapCreated) {
      payment = await this.paymentRepository.create({
        ...createPaymentDto,
        snapToken: snapCreated.token,
        redirectUrl: snapCreated.redirectUrl,
        providerOrderId,
      });

      snapCreated.id = payment.id;
      snapCreated.orderId = payment.providerOrderId ?? payment.orderId;
    }

    return snapCreated;
  }

  findAll(query: QueryParamsDto) {
    const { status, limit = 10, page = 1, orderId } = query;

    return this.paymentRepository.findAll({
      where: {
        status,
        orderId,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  findOne(id: string) {
    return this.paymentRepository.findOne(id);
  }

  async reCreate(orderId: string) {
    // Check available payment is'nt pending or paid
    const paymentExists = await this.paymentRepository.findAll({
      where: {
        orderId,
        status: In([
          PaymentStatus.CANCELLED,
          PaymentStatus.EXPIRED,
          PaymentStatus.FAILED,
        ]),
      },
      select: ['id', 'orderId', 'status', 'amount', 'attempt'],
      order: { attempt: 'DESC' },
      take: 1,
    });

    if (!paymentExists.length) {
      throw new UnprocessableEntityException(
        'No available payment to retry. Only payment with status cancelled, expired, or failed can be retried.',
      );
    }

    const payment = paymentExists[0];

    // Re create payment
    return this.create({
      orderId: payment.orderId,
      amount: payment.amount,
      attempt: payment.attempt + 1,
    });
  }

  async handleWebhook(payload: MidtransTransactionResponse) {
    const {
      order_id: orderId,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus = '',
      transaction_id: transactionId,
      payment_type: paymentType,
      expiry_time: expireTime,
    } = payload;

    this.logger.debug('Received webhook payload', payload);

    // Validate the signature
    const isValid = this.paymentProvider.verifyWebhook(payload);
    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    const payment =
      await this.paymentRepository.findOneByProviderOrderId(orderId);

    // Handle idempotency
    if (payment.status !== PaymentStatus.PENDING) return;

    // Update payment metadata
    payment.providerTransactionId = transactionId;
    payment.paymentMethod = paymentType;
    payment.expiredAt = expireTime ? new Date(expireTime) : undefined;

    // Add logs response
    payment.logs?.push({
      status: this.getPaymentStatus(transactionStatus),
      payload,
    } as PaymentLog);

    if (transactionStatus === 'capture' && fraudStatus === 'accept') {
      await this.markAs('capture', payment);
    } else {
      await this.markAs(transactionStatus, payment);
    }

    // Emit event to rmq
    const eventType = 'payment.updated';
    const event = new PaymentEvent(eventType, {
      id: payment.id,
      orderId: payment.orderId,
      status: this.getPaymentStatus(transactionStatus),
    });
    await lastValueFrom(this.client.emit(eventType, event));

    this.logger.debug('Emitted event', event);

    return {
      success: true,
    };
  }

  private markAs(transactionStatus: string, payment: Payment) {
    const paymentStatus = this.getPaymentStatus(transactionStatus);

    payment.status = paymentStatus;

    const isPaid = paymentStatus === PaymentStatus.PAID;
    if (isPaid) {
      payment.paidAt = new Date();
    }

    return this.paymentRepository.update(payment.id, payment);
  }

  private getPaymentStatus(transactionStatus: string) {
    const paymentStatus: Record<string, PaymentStatus> = {
      capture: PaymentStatus.PAID,
      settlement: PaymentStatus.PAID,
      pending: PaymentStatus.PENDING,
      deny: PaymentStatus.FAILED,
      cancel: PaymentStatus.CANCELLED,
      expire: PaymentStatus.EXPIRED,
      failure: PaymentStatus.FAILED,
    };

    return paymentStatus[transactionStatus];
  }
}
