import { IsNotEmpty, IsUUID } from 'class-validator';

export class ReservePromoDto {
  @IsNotEmpty()
  @IsUUID()
  promoId!: string;

  @IsNotEmpty()
  @IsUUID()
  orderId!: string;

  @IsNotEmpty()
  discountAmount!: number;

  @IsNotEmpty()
  totalOrder!: number;

  @IsNotEmpty()
  userId!: string;
}
