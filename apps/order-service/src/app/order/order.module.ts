import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductSnapshotModule } from '../product-snapshot/product-snapshot.module';
import { ProductOptionSnapshotModule } from '../product-option-snapshot/product-option-snapshot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemCustomization } from './entities/order-item-customization.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { HttpModule } from '@nestjs/axios';
import { PaymentClient } from '../common/client/payment.client';
import { RmqModule } from '@jum-caffe/common';

@Module({
  imports: [
    ProductSnapshotModule,
    ProductOptionSnapshotModule,
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderItemCustomization,
      OrderStatusHistory,
    ]),
    HttpModule,
    RmqModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, PaymentClient],
})
export class OrderModule {}
