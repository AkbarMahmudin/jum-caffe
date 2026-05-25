import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { BaseEntity } from '@jum-caffe/common';

@Entity('order_item_customizations')
export class OrderItemCustomization extends BaseEntity {
  @Column()
  optionName!: string;

  @Column()
  optionValueName!: string;

  @Column()
  additionalPrice!: number;

  @ManyToOne(() => OrderItem, (orderItem) => orderItem.customizations, {
    onDelete: 'CASCADE',
  })
  orderItem!: Order;
}
