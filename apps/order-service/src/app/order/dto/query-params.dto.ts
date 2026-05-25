import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum';

export class QueryParamsDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  @ApiPropertyOptional({ enum: OrderStatus, enumName: 'OrderStatus' })
  status?: OrderStatus;

  @IsOptional()
  @IsIn(['status', 'createdAt', 'updatedAt'])
  @ApiPropertyOptional({ enum: ['status', 'createdAt', 'updatedAt'] })
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  sort?: string;
}
