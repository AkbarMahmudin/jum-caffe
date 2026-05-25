import { DatabaseModule, RedisModule, RmqModule } from '@jum-caffe/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OutletModule } from './outlet/outlet.module';
import { OutletProductModule } from './outlet-product/outlet-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    RedisModule,
    DatabaseModule,
    RmqModule,
    OutletModule,
    OutletProductModule,
  ],
})
export class AppModule {}
