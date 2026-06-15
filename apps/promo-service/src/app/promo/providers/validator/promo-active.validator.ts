import { BadRequestException, Injectable } from '@nestjs/common';
import { PromoValidator } from './promo-validator.interface';
import { Promo } from '../../entities/promo.entity';

@Injectable()
export class PromoActiveValidator implements PromoValidator {
  async validate(promo: Promo): Promise<void> {
    if (!promo.isActive) {
      throw new BadRequestException('Promo is inactive');
    }
  }
}
