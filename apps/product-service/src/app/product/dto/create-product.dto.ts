import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  basePrice!: number;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  categoryId!: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  isActive?: boolean;
}
