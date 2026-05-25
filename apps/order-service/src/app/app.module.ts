import { Module } from '@nestjs/common';
import { ProductSnapshotModule } from './product-snapshot/product-snapshot.module';
import { ProductOptionSnapshotModule } from './product-option-snapshot/product-option-snapshot.module';
import { OrderModule } from './order/order.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, RmqModule } from '@jum-caffe/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    RmqModule,
    ProductSnapshotModule,
    ProductOptionSnapshotModule,
    OrderModule,
  ],
})
export class AppModule {}
