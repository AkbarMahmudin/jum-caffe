import { BaseRepository } from '@jum-caffe/common';
import { Injectable } from '@nestjs/common';
import { Promo } from '../entities/promo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PromoUsage } from '../entities/promo-usage.entity';

@Injectable()
export class PromoRepository extends BaseRepository<Promo> {
  constructor(
    @InjectRepository(Promo)
    protected readonly repository: Repository<Promo>,
    protected readonly dataSource?: DataSource,
  ) {
    super(repository, dataSource);
  }

  findByCode(code: string, manager?: EntityManager) {
    const repo = this.getRepo(manager);

    return repo.findOneByOrFail({ code });
  }

  async findAvailableByCustomer(customerId: string): Promise<Promo[]> {
    const now = new Date();

    return (
      this.repository
        .createQueryBuilder('promos')
        .leftJoin(
          PromoUsage,
          'usage',
          `
          usage.promoId = promos.id
          AND usage.userId = :customerId
          `,
          {
            customerId,
          },
        )
        .where('promos.isActive = true')
        .andWhere('promos.startAt <= :now', {
          now,
        })
        .andWhere('promos.endAt >= :now', {
          now,
        })
        .andWhere(
          '(promos.quota - promos.reservedQuota - promos.usedQuota) > 0',
        )
        // belum pernah digunakan
        .andWhere('usage.id IS NULL')
        .orderBy('promos.endAt', 'ASC')
        .getMany()
    );
  }
}
