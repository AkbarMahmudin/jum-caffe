import { Injectable } from '@nestjs/common';
import { OutletProductRepository } from './repositories/outlet-product.repository';
import { ProductCache } from '../product/cache/product.cache';

@Injectable()
export class OutletProductService {
  constructor(
    private readonly outletProductRepository: OutletProductRepository,
    private readonly productCache: ProductCache,
  ) {}

  async upsert(outletId: string, productIds: string[]) {
    await this.productCache.findOneAndDelete(`product:outlet:${outletId}`);
    return this.outletProductRepository.createMany(outletId, productIds);
  }

  async updateStatus(
    outletId: string,
    productIds: string[],
    isAvailable: boolean,
  ) {
    await this.productCache.findOneAndDelete(`product:outlet:${outletId}`);
    return this.outletProductRepository.updateStatus(
      outletId,
      productIds,
      isAvailable,
    );
  }
}
