import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('REDIS_HOST') || 'localhost';
        const port = configService.get('REDIS_PORT') || 6379;
        const expireIn = configService.get(
          'REDIS_TTL',
          30 * 24 * 60 * 60 * 1000,
        ); // Default to 30 days in milliseconds

        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: expireIn, lruSize: 5000 }),
            }),
            new KeyvRedis(`redis://${host}:${port}`),
          ],
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
