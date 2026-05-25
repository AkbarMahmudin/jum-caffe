import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  search?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  limit?: number;

  @IsOptional()
  @IsIn(['name', 'basePrice', 'createdAt', 'updatedAt'])
  @ApiPropertyOptional()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional()
  sort?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional()
  outletId?: string;
}
