import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';
import { MidtransProvider } from '../common/provider/midtrans/midtrans.provider';
import { PaymentLog } from './entities/payment-log.entity';
import { PAYMENT_SERVICE, RmqModule } from '@jum-caffe/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentLog]),
    RmqModule.register({ name: PAYMENT_SERVICE }),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    {
      provide: 'PaymentProviderInterface',
      useClass: MidtransProvider,
    },
  ],
})
export class PaymentModule {}
