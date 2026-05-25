import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { OrderSource } from '../enum/order-source.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  outletId!: string;

  @IsNotEmpty()
  @IsEnum(OrderSource)
  @ApiProperty({ enum: OrderSource })
  source!: OrderSource;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({ type: OrderItemDto, isArray: true })
  items!: OrderItemDto[];
}
