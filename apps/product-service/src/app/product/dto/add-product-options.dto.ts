import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddProductOptions {
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  @ApiProperty()
  optionIds!: string[];
}
