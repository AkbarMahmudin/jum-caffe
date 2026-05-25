import { BaseEvent } from '@jum-caffe/common';
import { Option } from '../entities/option.entity';
import { PRODUCT_SERVICE } from '@jum-caffe/common';

export class ProductOptionEvent extends BaseEvent<Partial<Option>> {
  constructor(eventType: string, payload: Partial<Option>) {
    super(eventType, payload);

    this.eventVersion = '1.0';
    this.producer = PRODUCT_SERVICE;
  }
}
