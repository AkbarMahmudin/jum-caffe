import { Injectable, Logger } from '@nestjs/common';
import { PromoRepository } from '../../repositories/promo.repository';
import { Promo } from '../../entities/promo.entity';
import { PromoUsage } from '../../entities/promo-usage.entity';
import { ReservePromoDto } from '../../dto/reserve-promo.dto';
import { PromoUsageStatus } from '../../../common/enum/promo-usage-status.enum';
import { PromoReservationCache } from './promo-reservation-cache.provider';

@Injectable()
export class PromoReservation {
  private readonly logger = new Logger(PromoReservation.name);

  constructor(
    private readonly promoRepository: PromoRepository,
    private readonly promoReservationCache: PromoReservationCache,
  ) {}

  async reserve({ promoId, ...dto }: ReservePromoDto) {
    const expireTime = 15 * 60 * 1000;

    const reserved = await this.promoRepository.withTransaction(
      async (manager) => {
        const promo = await manager.findOneOrFail(Promo, {
          where: { id: promoId },
          lock: { mode: 'pessimistic_write' },
        });

        promo.reservedQuota++;

        await manager.save(promo);

        return manager.save(PromoUsage, {
          ...dto,
          promo: { id: promoId },
          status: PromoUsageStatus.Reserved,
          expiredAt: new Date(Date.now() + expireTime),
        });
      },
    );

    await this.promoReservationCache.create(
      `promo:reservation:${dto.orderId}`,
      '1',
      expireTime,
    );

    return reserved;
  }

  release(orderId: string) {
    return this.promoRepository.withTransaction(async (manager) => {
      const usage = await manager.findOneOrFail(PromoUsage, {
        where: {
          orderId,
          status: PromoUsageStatus.Reserved,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      const promo = await manager.findOneOrFail(Promo, {
        where: {
          usages: { id: usage.id },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      promo.reservedQuota--;
      usage.status = PromoUsageStatus.Cancelled;
      usage.expiredAt = null;

      await manager.save(promo);
      await manager.save(usage);
    });
  }

  commit(orderId: string) {
    return this.promoRepository.withTransaction(async (manager) => {
      const usage = await manager.findOne(PromoUsage, {
        where: {
          orderId,
          status: PromoUsageStatus.Reserved,
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!usage) return;

      const promo = await manager.findOneOrFail(Promo, {
        where: {
          usages: { id: usage.id },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      promo.reservedQuota--;
      promo.usedQuota++;
      usage.status = PromoUsageStatus.Used;

      await manager.save(promo);
      await manager.save(usage);

      await this.promoReservationCache.findOneAndDelete(
        `promo:reservation:${orderId}`,
      );
    });
  }
}
