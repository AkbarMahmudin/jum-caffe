import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { hashPassword } from '@jum-caffe/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags({
  name: 'Auth',
})
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    const hashedPassword = hashPassword(registerUserDto.password, 10);

    await this.userService.register({
      ...registerUserDto,
      password: hashedPassword,
    });

    return {
      message: 'User registered successfully',
    };
  }
}
