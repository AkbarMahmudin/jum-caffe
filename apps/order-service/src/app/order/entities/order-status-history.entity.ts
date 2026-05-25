import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { Order } from './order.entity';

@Entity('order_status_histories')
export class OrderStatusHistory extends BaseEntity {
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status!: OrderStatus;

  @ManyToOne(() => Order, (order) => order.histories, { nullable: true })
  order!: Order;
}
