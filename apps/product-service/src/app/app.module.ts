import { Module } from '@nestjs/common';
import {
  DatabaseModule,
  JwtAuthGuard,
  JwtStrategy,
  RedisModule,
  RmqModule,
} from '@jum-caffe/common';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OptionModule } from './option/option.module';
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
    CategoryModule,
    OptionModule,
    OutletProductModule,
    ProductModule,
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
