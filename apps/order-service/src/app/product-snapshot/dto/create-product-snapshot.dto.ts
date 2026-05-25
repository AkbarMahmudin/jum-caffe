import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductSnapshotDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  productId!: string;

  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsNotEmpty()
  @ApiProperty()
  basePrice!: number;

  @IsNotEmpty()
  @ApiProperty()
  isActive!: boolean;

  @IsNotEmpty()
  @ApiProperty()
  version!: number;
}
