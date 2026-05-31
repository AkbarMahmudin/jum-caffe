import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  // @IsUUID()
  @ApiProperty()
  orderId!: string;

  @IsNumber()
  @ApiProperty()
  amount!: number;

  @IsOptional()
  attempt?: number;
}
