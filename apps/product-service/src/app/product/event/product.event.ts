import { BaseEvent } from '@jum-caffe/common';
import { Product } from '../entities/product.entity';
import { PRODUCT_SERVICE } from '@jum-caffe/common';

export class ProductEvent extends BaseEvent<Partial<Product>> {
  constructor(eventType?: string, payload?: Partial<Product>) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = PRODUCT_SERVICE;
  }
}
