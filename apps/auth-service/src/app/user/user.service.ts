import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from '@jum-caffe/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(dto: RegisterUserDto) {
    const userRegistered = await this.userRepository.create({
      ...dto,
      role: UserRole.Customer,
    });
    return userRegistered?._id;
  }
}
