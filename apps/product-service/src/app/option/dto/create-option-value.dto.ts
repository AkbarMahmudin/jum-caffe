import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOptionValueDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  additionalPrice!: number;
}
