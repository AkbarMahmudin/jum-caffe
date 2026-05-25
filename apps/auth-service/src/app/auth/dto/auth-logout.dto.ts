import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLogoutDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refreshToken!: string;
}
