import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products!: Product[];
}
