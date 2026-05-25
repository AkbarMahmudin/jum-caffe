import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Order } from './order.entity';
import { OrderItemCustomization } from './order-item-customization.entity';
import { BaseEntity } from '@jum-caffe/common';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column('uuid')
  productId!: string;

  // @Column()
  // productName!: string;

  @Column()
  quantity!: number;

  @Column()
  basePrice!: number;

  @Column()
  subTotal!: number;

  @ManyToOne(() => Order, (order) => order.items)
  order!: Order;

  @OneToMany(
    () => OrderItemCustomization,
    (orderItemCustomization) => orderItemCustomization.orderItem,
    { cascade: true },
  )
  customizations!: OrderItemCustomization[];
}
