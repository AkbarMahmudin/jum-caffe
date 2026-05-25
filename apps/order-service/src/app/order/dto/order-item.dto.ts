import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  productId!: string;

  @IsNotEmpty()
  @Min(1)
  @Max(10)
  @IsNumber()
  @ApiProperty()
  quantity!: number;

  @IsOptional()
  @IsUUID('all', { each: true })
  @ApiProperty({ type: 'string', isArray: true })
  customization?: string[];
}
