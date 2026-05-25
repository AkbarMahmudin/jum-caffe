import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOutletDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  address?: string;

  @IsLatitude()
  @IsNotEmpty()
  @ApiProperty()
  latitude!: number;

  @IsLongitude()
  @IsNotEmpty()
  @ApiProperty()
  longitude!: number;
}
