import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { ProductSnapshot } from '../entities/product-snapshot.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';

@Injectable()
export class ProductSnapshotRepository extends BaseRepository<ProductSnapshot> {
  constructor(
    @InjectRepository(ProductSnapshot)
    protected readonly repository: Repository<ProductSnapshot>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  async upsert(
    productId: string,
    data: QueryDeepPartialEntity<ProductSnapshot>,
    manager?: EntityManager,
  ): Promise<ProductSnapshot> {
    const repo = this.getRepo(manager);
    await repo.upsert(data, ['productId']);

    return repo.findOneOrFail({ where: { productId } });
  }

  async delete(productId: string, manager?: EntityManager): Promise<boolean> {
    const { affected } = await this.getRepo(manager).delete({ productId });
    return !!affected;
  }
}
