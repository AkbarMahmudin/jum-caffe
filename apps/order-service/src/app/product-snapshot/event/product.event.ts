import { BaseEvent } from '@jum-caffe/common';
import { PRODUCT_SERVICE } from '@jum-caffe/common';

interface Product {
  id: string;
  name: string;
  basePrice: number;
  isActive: boolean;
  version: number;
}

export class ProductEvent extends BaseEvent<Product> {
  constructor(eventType?: string, payload?: Product) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = PRODUCT_SERVICE;
  }
}
