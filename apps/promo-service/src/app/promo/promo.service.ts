import { Inject, Injectable } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { PromoRepository } from './repositories/promo.repository';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { PromoCalculator } from './providers/calculator/promo-calculator.provider';
import { PromoValidator } from './providers/validator/promo-validator.interface';
import { PromoReservation } from './providers/reservation/promo-reservation.provider';
import { ClsService } from 'nestjs-cls';
import { ILocalStorage } from '@jum-caffe/common';

@Injectable()
export class PromoService {
  constructor(
    private readonly promoRepository: PromoRepository,
    private readonly calculator: PromoCalculator,
    private readonly reservation: PromoReservation,
    private readonly cls: ClsService<ILocalStorage>,
    @Inject('PROMO_VALIDATORS')
    private readonly validators: PromoValidator[],
  ) {}

  create(createPromoDto: CreatePromoDto) {
    return this.promoRepository.create(createPromoDto);
  }

  findAll() {
    return this.promoRepository.findAll();
  }

  findOne(id: string) {
    return this.promoRepository.findOne(id);
  }

  update(id: string, updatePromoDto: UpdatePromoDto) {
    return this.promoRepository.update(id, updatePromoDto);
  }

  remove(id: string) {
    return this.promoRepository.delete(id);
  }

  async calculate(applyDto: ApplyPromoDto) {
    const promo = await this.promoRepository.findByCode(applyDto.code);

    for (const validator of this.validators) {
      await validator.validate(promo, applyDto);
    }

    const discount = this.calculator.calculate(promo, applyDto.orderAmount);

    return {
      promoId: promo.id,
      orderId: applyDto.orderId,
      discountAmount: discount,
      finalAmount: applyDto.orderAmount - discount,
    };
  }

  async reserve(applyDto: ApplyPromoDto) {
    const { promoId, orderId, discountAmount, finalAmount } =
      await this.calculate(applyDto);

    return this.reservation.reserve({
      promoId,
      orderId,
      discountAmount,
      totalOrder: finalAmount,
      userId: this.cls.get('user.sub'),
    });
  }

  findAvailable() {
    const customerId = this.cls.get('user.sub');

    return this.promoRepository.findAvailableByCustomer(customerId);
  }
}
