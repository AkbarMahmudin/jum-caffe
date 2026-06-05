import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { comparePassword } from '@jum-caffe/common';
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

    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user._id,
      name: user.name,
      email: user.email,
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

    const newAccessToken = this.jwtService.sign({
      email: tokenData.email,
      sub: tokenData.userId,
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

  profile(userId: string) {
    return this.userRepository.findOne(
      { _id: userId },
      { lean: true, projection: '-password' },
    );
  }
}
