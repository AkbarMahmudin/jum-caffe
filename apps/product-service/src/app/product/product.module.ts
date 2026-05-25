import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductRepository } from './repositories/product.repository';
import { ProductCache } from './cache/product.cache';
import { RmqModule } from '@jum-caffe/common';
import { PRODUCT_SERVICE } from '@jum-caffe/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    RmqModule.register({ name: PRODUCT_SERVICE }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductCache],
})
export class ProductModule {}
