import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Promo } from './promo.entity';
import { PromoUsageStatus } from '../../common/enum/promo-usage-status.enum';

@Entity('promo_usages')
@Unique(['promo.id', 'userId'])
export class PromoUsage extends BaseEntity {
  @Column()
  userId!: string;

  @Column({ unique: true })
  orderId!: string;

  @Column()
  totalOrder!: number;

  @Column()
  discountAmount!: number;

  @Column({
    type: 'enum',
    enum: PromoUsageStatus,
    default: PromoUsageStatus.Reserved,
  })
  status!: PromoUsageStatus;

  @ManyToOne(() => Promo, (promo) => promo.usages)
  promo!: Promo;

  @Column({ type: 'timestamptz', nullable: true })
  expiredAt?: Date | null;
}
