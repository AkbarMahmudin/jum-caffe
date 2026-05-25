import { Injectable } from '@nestjs/common';
import { OutletProductRepository } from './repositories/outlet-product.repository';

@Injectable()
export class OutletProductService {
  constructor(
    private readonly outletProductRepository: OutletProductRepository,
  ) {}

  async upsert(outletId: string, productIds: string[]) {
    return this.outletProductRepository.createMany(outletId, productIds);
  }

  async updateStatus(
    outletId: string,
    productIds: string[],
    isAvailable: boolean,
  ) {
    return this.outletProductRepository.updateStatus(
      outletId,
      productIds,
      isAvailable,
    );
  }
}
