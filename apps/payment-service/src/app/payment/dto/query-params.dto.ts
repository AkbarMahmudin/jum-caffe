import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PaymentStatus } from '../../common/enum/payment-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryParamsDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  @ApiPropertyOptional({ enum: PaymentStatus, enumName: 'PaymentStatus' })
  status?: PaymentStatus;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  limit?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  page?: number;

  @IsOptional()
  @ApiPropertyOptional()
  orderId?: string;
}
