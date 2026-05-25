import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateProductOptionSnapshotDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  optionId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  optionName!: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  optionValueId!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  optionValueName!: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  additionalPrice!: number;
}
