import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
} from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  @ApiPropertyOptional()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  @ApiPropertyOptional()
  longitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @ApiPropertyOptional()
  radius?: number; // meter (default: 5000)

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search?: string;
}
