import { BaseEntity } from '@jum-caffe/common';
import { Category } from '../../category/entities/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Option } from '../../option/entities/option.entity';
import { OutletProduct } from '../../outlet-product/entities/outlet-product.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name!: string;

  @Column('varchar', { nullable: true })
  imageUrl?: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('int', { default: 0 })
  basePrice!: number;

  @Column('int', { default: 1 })
  version?: number;

  @Column('boolean', { default: true })
  isActive?: boolean;

  @ManyToOne(() => Category, (category) => category.products)
  category!: Category;

  @ManyToMany(() => Option)
  @JoinTable()
  options!: Option[];

  @OneToMany(() => OutletProduct, (outletProduct) => outletProduct.product)
  outletProducts?: OutletProduct[];
}
