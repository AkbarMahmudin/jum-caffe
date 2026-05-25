import { Module } from '@nestjs/common';
import { ProductOptionSnapshotService } from './product-option-snapshot.service';
import { ProductOptionSnapshotConsumer } from './product-option-snapshot.consumer';
import { ProductOptionSnapshotRepository } from './repositories/product-option-snapshot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionSnapshot } from './entities/product-option-snapshot.entity';
import { RmqModule } from '@jum-caffe/common';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionSnapshot]), RmqModule],
  controllers: [ProductOptionSnapshotConsumer],
  providers: [ProductOptionSnapshotService, ProductOptionSnapshotRepository],
  exports: [ProductOptionSnapshotRepository],
})
export class ProductOptionSnapshotModule {}
