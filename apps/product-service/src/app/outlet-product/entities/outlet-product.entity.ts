import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('outlet_products')
@Index(['outletId', 'productId'], { unique: true })
export class OutletProduct extends BaseEntity {
  @Column('uuid')
  outletId!: string;

  @Column('uuid')
  productId!: string;

  @Column('boolean')
  isAvailable!: boolean;

  @ManyToOne(() => Product)
  product?: Product;
}
