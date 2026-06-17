import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { PromoController } from './promo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './entities/promo.entity';
import { PromoRepository } from './repositories/promo.repository';
import { PromoCalculator } from './providers/calculator/promo-calculator.provider';
import {
  PromoActiveValidator,
  PromoPeriodValidator,
  PromoMinOrderValidator,
  PromoQuotaValidator,
} from './providers/validator';
import { PromoUsage } from './entities/promo-usage.entity';
import {
  PromoReservation,
  PromoReservationCache,
  PromoReservationExpired,
} from './providers/reservation';
import { RmqModule } from '@jum-caffe/common';

@Module({
  imports: [TypeOrmModule.forFeature([Promo, PromoUsage]), RmqModule],
  controllers: [PromoController],
  providers: [
    PromoService,
    PromoRepository,
    PromoCalculator,
    PromoReservation,
    PromoReservationCache,
    PromoReservationExpired,
    PromoActiveValidator,
    PromoPeriodValidator,
    PromoMinOrderValidator,
    PromoQuotaValidator,
    {
      provide: 'PROMO_VALIDATORS',
      useFactory: (active, period, minimun, quota) => [
        active,
        period,
        minimun,
        quota,
      ],
      inject: [
        PromoActiveValidator,
        PromoPeriodValidator,
        PromoMinOrderValidator,
        PromoQuotaValidator,
      ],
    },
  ],
})
export class PromoModule {}
