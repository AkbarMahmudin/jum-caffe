import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsOptional()
  @IsString()
  _id!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password!: string;
}
