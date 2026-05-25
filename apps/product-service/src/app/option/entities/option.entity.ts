import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, OneToMany } from 'typeorm';
import { OptionValue } from './option-value.entity';

@Entity('options')
export class Option extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => OptionValue, (optionValue) => optionValue.option, {
    cascade: true,
  })
  values!: OptionValue[];
}
