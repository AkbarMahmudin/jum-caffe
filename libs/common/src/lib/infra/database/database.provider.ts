import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitializer implements OnModuleInit {
  private readonly logger = new Logger(DatabaseInitializer.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.enablePostGIS();
  }

  private async enablePostGIS() {
    try {
      await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS postgis`);
      this.logger.log('✅ PostGIS extension enabled');
    } catch (error) {
      this.logger.error('❌ Failed to enable PostGIS:', error);
    }
  }
}
