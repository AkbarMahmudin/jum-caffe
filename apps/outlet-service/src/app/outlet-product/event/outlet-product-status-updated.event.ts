import { BaseEvent } from '@jum-caffe/common';

export class OutletProductStatusUpdatedEvent extends BaseEvent<{
  outletId: string;
  productIds: string[];
  isAvailable: boolean;
  assignedAt?: string;
}> {
  constructor() {
    super();

    this.payload.assignedAt = new Date().toISOString();
  }
}
