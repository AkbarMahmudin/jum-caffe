import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RedisModule, RmqModule } from '@jum-caffe/common';
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
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
