import { OrderStatus } from '../enum/order-status.enum';
import { OrderSource } from '../enum/order-source.enum';
import { Column, Entity, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '@jum-caffe/common';
import { OrderStatusHistory } from './order-status-history.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column('uuid')
  outletId!: string;

  // @Column('uuid')
  // userId!: string;

  @Column({ default: 0 })
  totalPrice!: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({ type: 'enum', enum: OrderSource, default: OrderSource.NORMAL })
  source!: OrderSource;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order, {
    cascade: true,
  })
  histories!: OrderStatusHistory[];
}
