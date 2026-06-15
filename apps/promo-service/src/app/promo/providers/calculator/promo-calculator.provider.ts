import { Injectable } from '@nestjs/common';
import { Promo } from '../../entities/promo.entity';
import { PromoType } from '../../../common/enum/promo-type.enum';

@Injectable()
export class PromoCalculator {
  calculate(promo: Promo, amount: number): number {
    if (promo.type === PromoType.Fixed) {
      return Math.min(promo.value, amount);
    }

    let discount = amount * (promo.value / 100);

    if (promo.maxDiscount) {
      discount = Math.min(discount, promo.maxDiscount);
    }

    return Math.floor(discount);
  }
}
