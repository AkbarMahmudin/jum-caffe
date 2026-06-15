import { BadRequestException, Injectable } from '@nestjs/common';
import { PromoValidator } from './promo-validator.interface';
import { Promo } from '../../entities/promo.entity';

@Injectable()
export class PromoPeriodValidator implements PromoValidator {
  async validate(promo: Promo): Promise<void> {
    const now = new Date();

    if (promo.startAt && now < promo.startAt) {
      throw new BadRequestException('Promo not started');
    }

    if (promo.endAt && now > promo.endAt) {
      throw new BadRequestException('Promo expired');
    }
  }
}
