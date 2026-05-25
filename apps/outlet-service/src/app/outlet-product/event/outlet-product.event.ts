import { BaseEvent, OUTLET_SERVICE } from '@jum-caffe/common';

interface Payload {
  outletId: string;
  productIds: string[];
  isAvailable?: boolean;
  assignedAt?: string;
}

export class OutletProductEvent extends BaseEvent<Partial<Payload>> {
  constructor(eventType?: string, payload?: Partial<Payload>) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = OUTLET_SERVICE;
  }
}
