import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity } from 'typeorm';

@Entity('product_snapshots')
export class ProductSnapshot extends BaseEntity {
  @Column('uuid', { unique: true })
  productId!: string;

  @Column()
  name!: string;

  @Column()
  basePrice!: number;

  @Column()
  isActive!: boolean;

  @Column()
  version!: number;
}
