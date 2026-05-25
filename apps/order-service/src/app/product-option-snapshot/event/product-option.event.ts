import { BaseEvent } from '@jum-caffe/common';
import { PRODUCT_SERVICE } from '@jum-caffe/common';

interface Payload {
  id: string;
  name: string;
  values: {
    id: string;
    name: string;
    additionalPrice: number;
  }[];
}

export class ProductOptionEvent extends BaseEvent<Payload> {
  constructor(eventType: string, payload: Payload) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = PRODUCT_SERVICE;
  }
}
