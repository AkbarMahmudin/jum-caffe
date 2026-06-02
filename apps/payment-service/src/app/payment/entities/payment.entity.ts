import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { PaymentStatus } from '../../common/enum/payment-status.enum';
import { PaymentProvider } from '../../common/enum/payment-provider.enum';
import { PaymentLog } from './payment-log.entity';

@Entity('payments')
@Unique(['orderId', 'attempt'])
export class Payment extends BaseEntity {
  @Column()
  orderId!: string;

  @Column({ default: 1 })
  attempt!: number;

  @Column()
  amount!: number;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status?: PaymentStatus;

  // Meta data from payment gateway
  @Column({
    type: 'enum',
    enum: PaymentProvider,
    nullable: true,
    default: PaymentProvider.MIDTRANS,
  })
  provider?: PaymentProvider;

  @Column({ nullable: true })
  providerTransactionId?: string;

  @Column({ nullable: true })
  providerOrderId?: string;

  @Column()
  snapToken!: string;

  @Column()
  redirectUrl!: string;

  @Column({ nullable: true })
  paidAt?: Date;

  @Column({ nullable: true })
  expiredAt?: Date;

  @OneToMany(() => PaymentLog, (log) => log.payment, {
    cascade: true,
  })
  logs?: PaymentLog[];
}
