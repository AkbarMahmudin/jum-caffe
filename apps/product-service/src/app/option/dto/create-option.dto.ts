import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOptionValueDto } from './create-option-value.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionValueDto)
  @IsOptional()
  @ApiProperty({ type: CreateOptionValueDto, isArray: true })
  values!: CreateOptionValueDto[];
}
