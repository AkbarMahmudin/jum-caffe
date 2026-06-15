import { ApplyPromoDto } from '../../dto/apply-promo.dto';
import { Promo } from '../../entities/promo.entity';

export interface PromoValidator {
  validate(promo: Promo, payload: ApplyPromoDto): Promise<void>;
}
