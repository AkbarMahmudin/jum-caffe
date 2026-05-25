import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Option } from './option.entity';

@Entity('option_values')
export class OptionValue extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'int', default: 0 })
  additionalPrice!: number;

  @ManyToOne(() => Option, (option) => option.values)
  option!: Option;
}
