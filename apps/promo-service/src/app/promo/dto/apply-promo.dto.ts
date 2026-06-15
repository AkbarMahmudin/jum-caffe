import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class ApplyPromoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  orderId!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  orderAmount!: number;
}
