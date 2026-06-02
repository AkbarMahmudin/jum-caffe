import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, ManyToOne } from 'typeorm';
import { PaymentStatus } from '../../common/enum/payment-status.enum';
import { Payment } from './payment.entity';

@Entity('payment_logs')
export class PaymentLog extends BaseEntity {
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status!: PaymentStatus;

  @Column({ type: 'jsonb' })
  payload!: any;

  @ManyToOne(() => Payment, (payment) => payment.logs)
  payment!: Payment;
}
