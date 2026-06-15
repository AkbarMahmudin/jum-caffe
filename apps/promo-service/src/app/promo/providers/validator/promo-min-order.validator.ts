import { BadRequestException, Injectable } from '@nestjs/common';
import { PromoValidator } from './promo-validator.interface';
import { Promo } from '../../entities/promo.entity';
import { ApplyPromoDto } from '../../dto/apply-promo.dto';

@Injectable()
export class PromoMinOrderValidator implements PromoValidator {
  async validate(promo: Promo, payload: ApplyPromoDto): Promise<void> {
    if (promo.minOrder && payload.orderAmount < promo.minOrder) {
      throw new BadRequestException('Minimum order not reached');
    }
  }
}
