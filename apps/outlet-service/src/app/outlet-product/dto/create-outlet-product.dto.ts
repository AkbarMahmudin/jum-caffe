import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOutletProductDto {
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  @ApiProperty()
  productIds!: string[];
}
