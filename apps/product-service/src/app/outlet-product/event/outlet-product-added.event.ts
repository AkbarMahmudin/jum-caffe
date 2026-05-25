import { BaseEvent } from '@jum-caffe/common';

export class OutletProductAddedEvent extends BaseEvent<{
  outletId: string;
  productIds: string[];
  assignedAt: string;
}> {
  constructor() {
    super();

    this.payload.assignedAt = new Date().toISOString();
  }
}
