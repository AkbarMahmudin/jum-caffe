import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  @ApiProperty({ enum: OrderStatus, enumName: 'OrderStatus' })
  status!: OrderStatus;
}
