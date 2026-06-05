import { Module } from '@nestjs/common';
import { OutletProductService } from './outlet-product.service';
import { OutletProductConsumer } from './outlet-product.consumer';
import { OutletProductRepository } from './repositories/outlet-product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletProduct } from './entities/outlet-product.entity';
import { RmqModule } from '@jum-caffe/common';
import { ProductCache } from '../product/cache/product.cache';

@Module({
  imports: [TypeOrmModule.forFeature([OutletProduct]), RmqModule],
  controllers: [OutletProductConsumer],
  providers: [OutletProductService, OutletProductRepository, ProductCache],
})
export class OutletProductModule {}
