import { BaseEvent } from '@jum-caffe/common';
import { PAYMENT_SERVICE } from '@jum-caffe/common';

interface Payment {
  id: string;
  status: string;
  orderId: string;
}

export class PaymentEvent extends BaseEvent<Payment> {
  constructor(eventType?: string, payload?: Payment) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = PAYMENT_SERVICE;
  }
}
