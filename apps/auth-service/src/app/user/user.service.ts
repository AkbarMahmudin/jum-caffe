import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: RegisterUserDto) {
    const userRegistered = await this.userRepository.create(dto);
    return userRegistered?._id;
  }
}
