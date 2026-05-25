import { Module } from '@nestjs/common';
import { ProductSnapshotService } from './product-snapshot.service';
import { ProductSnapshotConsumer } from './product-snapshot.consumer';
import { ProductSnapshotRepository } from './repositories/product-snapshot.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSnapshot } from './entities/product-snapshot.entity';
import { RmqModule } from '@jum-caffe/common';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSnapshot]), RmqModule],
  controllers: [ProductSnapshotConsumer],
  providers: [ProductSnapshotService, ProductSnapshotRepository],
  exports: [ProductSnapshotRepository],
})
export class ProductSnapshotModule {}
