import { Column, Entity, OneToMany } from 'typeorm';
import { PromoType } from '../../common/enum/promo-type.enum';
import { BaseEntity } from '@jum-caffe/common';
import { PromoUsage } from './promo-usage.entity';

@Entity('promos')
export class Promo extends BaseEntity {
  @Column({ unique: true })
  code!: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  value!: number;

  @Column('enum', { enum: PromoType })
  type!: PromoType;

  @Column({ nullable: true })
  maxDiscount?: number;

  @Column({ nullable: true, default: 0 })
  minOrder?: number;

  @Column({ type: 'timestamptz' })
  startAt!: Date;

  @Column({ type: 'timestamptz' })
  endAt!: Date;

  @Column({ default: 0 })
  quota!: number;

  @Column({ default: 0 })
  usedQuota!: number;

  @Column({ default: 0 })
  reservedQuota!: number;

  @Column()
  isActive!: boolean;

  @OneToMany(() => PromoUsage, (promoUsage) => promoUsage.promo, {
    cascade: true,
  })
  usages?: PromoUsage[];
}
