import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, Index } from 'typeorm';

@Entity('product_option_snapshots')
@Index(['optionId', 'optionName'])
export class ProductOptionSnapshot extends BaseEntity {
  @Column('uuid')
  optionId!: string;

  @Column()
  optionName!: string;

  @Column('uuid')
  optionValueId!: string;

  @Column()
  optionValueName!: string;

  @Column()
  additionalPrice!: number;
}
