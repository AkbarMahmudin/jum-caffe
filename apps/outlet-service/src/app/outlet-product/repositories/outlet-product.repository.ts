import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { OutletProduct } from '../entities/outlet-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';

@Injectable()
export class OutletProductRepository extends BaseRepository<OutletProduct> {
  constructor(
    @InjectRepository(OutletProduct)
    protected readonly repository: Repository<OutletProduct>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  async createMany(outletId: string, productIds: string[]) {
    return this.withTransaction(async (trx) => {
      const payloads = productIds.map((productId) => ({
        outletId,
        productId,
        isActive: true,
      }));
      await trx.delete(OutletProduct, { outletId });
      await trx.upsert(OutletProduct, payloads, ['outletId', 'productId']);

      return payloads;
    });
  }

  async updateStatus(
    outletId: string,
    productIds: string[],
    isAvailable: boolean,
    manager?: EntityManager,
  ) {
    const repo = this.getRepo(manager);
    return repo.update(
      { outletId, productId: In(productIds) },
      { isAvailable },
    );
  }
}
