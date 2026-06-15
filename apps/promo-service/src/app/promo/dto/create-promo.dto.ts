import { PromoType } from '../../common/enum/promo-type.enum';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  value!: number;

  @IsNotEmpty()
  @IsEnum(PromoType)
  @ApiProperty({ enum: PromoType, enumName: 'PromoType' })
  type!: PromoType;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  maxDiscount!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  minOrder!: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  startAt!: Date;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  endAt!: Date;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  quota!: number;

  @IsNotEmpty()
  @ApiProperty()
  @Type(() => Boolean)
  isActive!: boolean;
}
