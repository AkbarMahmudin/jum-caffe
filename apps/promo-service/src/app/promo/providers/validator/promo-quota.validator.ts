import { BadRequestException, Injectable } from '@nestjs/common';
import { PromoValidator } from './promo-validator.interface';
import { Promo } from '../../entities/promo.entity';

@Injectable()
export class PromoQuotaValidator implements PromoValidator {
  async validate(promo: Promo): Promise<void> {
    const available = promo.quota - promo.reservedQuota - promo.usedQuota;

    if (available <= 0) {
      throw new BadRequestException('Promo quota exceeded');
    }
  }
}
