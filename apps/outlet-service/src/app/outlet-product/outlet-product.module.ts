import { Module } from '@nestjs/common';
import { OutletProductService } from './outlet-product.service';
import { OutletProductController } from './outlet-product.controller';
import { OutletProductRepository } from './repositories/outlet-product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutletProduct } from './entities/outlet-product.entity';
import { RmqModule } from '@jum-caffe/common';
import { OUTLET_SERVICE } from '@jum-caffe/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutletProduct]),
    RmqModule.register({ name: OUTLET_SERVICE }),
  ],
  controllers: [OutletProductController],
  providers: [OutletProductService, OutletProductRepository],
})
export class OutletProductModule {}
