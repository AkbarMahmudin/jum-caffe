import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, Index } from 'typeorm';

@Entity('outlet_products')
@Index(['outletId', 'productId'], { unique: true })
export class OutletProduct extends BaseEntity {
  @Column('uuid')
  outletId!: string;

  @Column('uuid')
  productId!: string;

  @Column('boolean', { default: true })
  isAvailable!: boolean;
}
