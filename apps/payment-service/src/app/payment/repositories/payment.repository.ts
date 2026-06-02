import { BaseRepository } from '@jum-caffe/common';
import { Injectable } from '@nestjs/common';
import { Payment } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';

@Injectable()
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    protected readonly repository: Repository<Payment>,
    protected readonly dataSource?: DataSource,
  ) {
    super(repository, dataSource);
  }

  async update(
    id: string,
    data: QueryDeepPartialEntity<Payment>,
    manager?: EntityManager,
  ): Promise<Payment> {
    const repo = this.getRepo(manager);

    const payment = await repo.findOneByOrFail({ id });

    const merged = repo.merge(payment, data as DeepPartial<Payment>);

    return repo.save(merged, { reload: true });
  }

  findOneByProviderOrderId(providerOrderId: string, manager?: EntityManager) {
    const repo = this.getRepo(manager);

    return repo.findOneOrFail({
      where: {
        providerOrderId,
      },
      relations: ['logs'],
    });
  }

  findByOrderId(orderId: string, manager?: EntityManager) {
    const repo = this.getRepo(manager);

    return repo.findBy({ orderId });
  }
}
