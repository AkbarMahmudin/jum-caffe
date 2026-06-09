import {
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { comparePassword, IUserAuth } from '@jum-caffe/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    const isMatch = user && comparePassword(password, user.password);

    if (!user || !isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(user: User) {
    const payload: IUserAuth = {
      sub: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(32).toString('hex');

    // Store refresh token in Redis with an expiration time
    await this.refreshTokenRepository.create({
      accessToken,
      refreshToken,
      email: user.email,
      userId: user._id,
    });

    return {
      refreshToken,
      accessToken,
      type: 'Bearer',
    };
  }

  async getNewAccessToken(refreshToken: string) {
    const tokenData = await this.refreshTokenRepository.findOne({
      refreshToken,
    });

    if (!tokenData) {
      throw new UnprocessableEntityException('Invalid refresh token');
    }

    const user = await this.userRepository.findByEmail(tokenData.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newAccessToken = this.jwtService.sign<IUserAuth>({
      sub: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
      type: 'Bearer',
    };
  }

  logout(refreshToken: string) {
    return this.refreshTokenRepository.findOneAndDelete({
      refreshToken,
    });
  }

  async profile(userId: string) {
    const user = await this.userRepository.findOneOrFail(
      { _id: userId },
      { lean: true, projection: '-password' },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { _id, ...rest } = user;

    return {
      id: _id,
      ...rest,
    };
  }
}
