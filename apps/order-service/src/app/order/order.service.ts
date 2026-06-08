import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductSnapshotRepository } from '../product-snapshot/repositories/product-snapshot.repository';
import { ProductOptionSnapshotRepository } from '../product-option-snapshot/repositories/product-option-snapshot.repository';
import { In } from 'typeorm';
import { ProductSnapshot } from '../product-snapshot/entities/product-snapshot.entity';
import { ProductOptionSnapshot } from '../product-option-snapshot/entities/product-option-snapshot.entity';
import { CalculatedOrderItem } from '../common/interface/calculated-order-item.interface';
import { OrderRepository } from './repositories/order.repository';
import { QueryParamsDto } from './dto/query-params.dto';
import { OrderStatus } from '../common/enum/order-status.enum';
import { PaymentClient } from '../common/client/payment.client';
import { CreatePaymentResponse } from '../common/interface/create-payment-response.interface';
import { ClsService } from 'nestjs-cls';
import { ILocalStorage } from '@jum-caffe/common';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly productRepo: ProductSnapshotRepository,
    private readonly productOptionRepo: ProductOptionSnapshotRepository,
    private readonly orderRepository: OrderRepository,
    private readonly paymentClient: PaymentClient,
    private readonly cls: ClsService<ILocalStorage>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    // TODO: implement idempotency key
    const payload = await this.buildOrderPayload(createOrderDto);

    const order = await this.orderRepository.create({
      ...payload,
      status: OrderStatus.WAITING_PAYMENT,
      userId: this.cls.get('user.sub'),
    });

    let payment: CreatePaymentResponse | null = null;

    try {
      payment = await this.paymentClient.createPayment({
        orderId: order.id,
        amount: order.totalPrice,
      });
    } catch (error) {
      this.logger.warn(`Failed create payment for order ${order.id}`);
    }

    return {
      ...order,
      payment,
    };
  }

  findAll(query: QueryParamsDto) {
    const { status, limit, sortBy, sort } = query;

    return this.orderRepository.findAll({
      where: {
        status,
        userId: this.cls.get('user.sub'),
      },
      take: limit,
      order: {
        [sortBy ?? 'createdAt']: sort?.toUpperCase() ?? 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.orderRepository.findOneWithUser(id, this.cls.get('user.sub'));
  }

  // ! DRAFT
  // async update(id: string, updateOrderDto: UpdateOrderDto) {
  //   await this.orderRepository.findOne(id);

  //   const payload = await this.buildOrderPayload(updateOrderDto);

  //   return this.orderRepository.update(id, payload);
  // }

  updateStatus(id: string, status: OrderStatus) {
    return this.orderRepository.updateStatus(id, status);
  }

  // ----------------------------------- ===== -----------------------------------
  // ----------------------------------- UTILS -----------------------------------
  // ----------------------------------- ===== -----------------------------------

  private async prepareOrderCalculation(dto: CreateOrderDto | UpdateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    const customizationIds = dto.items.flatMap((item) => item.customization);

    // 1. Get products
    const products = await this.productRepo.findAll({
      where: {
        productId: In(productIds),
      },
    });

    // 2. Get customizations/options
    const customizations = await this.productOptionRepo.findAll({
      where: {
        optionValueId: In(customizationIds),
      },
    });

    // 3. Calculate pricing
    return this.calculateOrderTotal(dto, products, customizations);
  }

  private buildOrderItems(items: CalculatedOrderItem[]) {
    return items.map((item) => ({
      basePrice: item.basePrice,

      productId: item.productId,

      quantity: item.quantity,

      subTotal: item.subTotal,

      customizations: item.customizations,
    }));
  }

  private calculateOrderTotal(
    dto: CreateOrderDto | UpdateOrderDto,
    products: ProductSnapshot[],
    options: ProductOptionSnapshot[],
  ): {
    items: CalculatedOrderItem[];
    grandTotal: number;
  } {
    const productMapped = new Map(
      products.map((product) => [product.productId, product]),
    );
    const optionMapped = new Map(
      options.map((option) => [option.optionValueId, option]),
    );

    const calculatedItems: CalculatedOrderItem[] = [];

    let grandTotal = 0;

    for (const item of dto.items) {
      const product = productMapped.get(item.productId);

      if (!product) {
        throw new BadRequestException(`Product not found: ${item.productId}`);
      }

      if (item.quantity <= 0) {
        throw new BadRequestException('Invalid quantity');
      }

      let customizationTotalPrice = 0;

      const mappedCustomizations: CalculatedOrderItem['customizations'] = [];

      for (const optionId of item?.customization ?? []) {
        const option = optionMapped.get(optionId);

        if (!option) {
          throw new BadRequestException(`Option not found: ${optionId}`);
        }

        customizationTotalPrice += option.additionalPrice;

        mappedCustomizations.push({
          optionId: option.optionId,
          optionName: option.optionName,
          optionValueId: option.optionValueId,
          optionValueName: option.optionValueName,
          additionalPrice: option.additionalPrice,
        });
      }

      const singleItemPrice = product.basePrice + customizationTotalPrice;

      const subTotal = singleItemPrice * item.quantity;

      grandTotal += subTotal;

      calculatedItems.push({
        productId: product.id,
        productName: product.name,

        quantity: item.quantity,

        basePrice: product.basePrice,

        customizationTotalPrice,

        singleItemPrice,

        subTotal,

        customizations: mappedCustomizations,
      });
    }

    return {
      items: calculatedItems,
      grandTotal,
    };
  }

  private async buildOrderPayload(dto: CreateOrderDto | UpdateOrderDto) {
    const { items, grandTotal } = await this.prepareOrderCalculation(dto);

    return {
      outletId: dto.outletId,

      source: dto.source,

      totalPrice: grandTotal,

      items: this.buildOrderItems(items),
    };
  }
}
