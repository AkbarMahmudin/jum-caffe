import { BaseEvent } from '@jum-caffe/common';
import { Payment } from '../entities/payment.entity';
import { PAYMENT_SERVICE } from '@jum-caffe/common';

export class PaymentEvent extends BaseEvent<Partial<Payment>> {
  constructor(eventType?: string, payload?: Partial<Payment>) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = PAYMENT_SERVICE;
  }
}
