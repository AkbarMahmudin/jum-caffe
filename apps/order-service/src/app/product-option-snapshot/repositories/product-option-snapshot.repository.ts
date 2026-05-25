import { BaseRepository } from '@jum-caffe/common';
import { ProductOptionSnapshot } from '../entities/product-option-snapshot.entity';
import {
  DataSource,
  EntityManager,
  In,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

export class ProductOptionSnapshotRepository extends BaseRepository<ProductOptionSnapshot> {
  constructor(
    @InjectRepository(ProductOptionSnapshot)
    protected readonly repository: Repository<ProductOptionSnapshot>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  async upsert(data: QueryDeepPartialEntity<ProductOptionSnapshot>[]) {
    return this.withTransaction(async (trx) => {
      await trx.delete(ProductOptionSnapshot, {
        optionId: In(data.map((item) => item.optionId)),
      });
      await trx.insert(ProductOptionSnapshot, data);
    });
  }

  async deleteByOptionId(optionId: string, manager?: EntityManager) {
    const repo = this.getRepo(manager);

    return repo.delete({
      optionId,
    });
  }
}
