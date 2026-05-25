import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNewAccessTokenDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refreshToken!: string;
}
