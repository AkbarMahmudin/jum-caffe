import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy, RedisModule } from '@jum-caffe/common';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenSchema } from './entities/refresh-token.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    RedisModule,
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'default_secret',
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') || '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenRepository],
})
export class AuthModule {}
