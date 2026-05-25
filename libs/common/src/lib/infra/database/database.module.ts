import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database-config.service';
import { DatabaseInitializer } from './database.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigService,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseInitializer],
  exports: [],
})
export class DatabaseModule {}
