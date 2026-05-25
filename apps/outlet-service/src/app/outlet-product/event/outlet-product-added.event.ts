import { BaseEvent, OUTLET_SERVICE } from '@jum-caffe/common';

interface Payload {
  outletId: string;
  productIds: string[];
  assignedAt: string;
}

export class OutletProductAddedEvent extends BaseEvent<Partial<Payload>> {
  constructor(eventType?: string, payload?: Partial<Payload>) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = OUTLET_SERVICE;
  }
}
