import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOutletProductDto } from './create-outlet-product.dto';
import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateOutletProductDto extends PartialType(
  CreateOutletProductDto,
) {
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  @ApiProperty()
  productIds!: string[];

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  isAvailable!: boolean;
}
