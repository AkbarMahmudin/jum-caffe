import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  JwtAuthGuard,
  JwtStrategy,
  LocalStorageModule,
  RedisModule,
  RmqModule,
} from '@jum-caffe/common';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    RedisModule,
    DatabaseModule,
    RmqModule,
    LocalStorageModule,
    PaymentModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
