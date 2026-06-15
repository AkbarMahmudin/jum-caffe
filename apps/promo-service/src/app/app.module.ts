import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  JwtAuthGuard,
  JwtStrategy,
  LocalStorageModule,
  RedisModule as CacheModule,
  RmqModule,
  RolesGuard,
} from '@jum-caffe/common';
import { PromoModule } from './promo/promo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    RmqModule,
    LocalStorageModule,
    PromoModule,
    CacheModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
