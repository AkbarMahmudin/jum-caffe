import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outlet } from './entities/outlet.entity';
import { OutletRepository } from './repositories/outlet.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Outlet])],
  controllers: [OutletController],
  providers: [OutletService, OutletRepository],
})
export class OutletModule {}
