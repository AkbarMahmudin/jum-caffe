import { Injectable } from '@nestjs/common';
import { CreateProductSnapshotDto } from './dto/create-product-snapshot.dto';
import { UpdateProductSnapshotDto } from './dto/update-product-snapshot.dto';
import { ProductSnapshotRepository } from './repositories/product-snapshot.repository';

@Injectable()
export class ProductSnapshotService {
  constructor(
    private readonly productSnapshotRepository: ProductSnapshotRepository,
  ) {}

  create(createProductSnapshotDto: CreateProductSnapshotDto) {
    return this.productSnapshotRepository.upsert(
      createProductSnapshotDto.productId,
      createProductSnapshotDto,
    );
  }

  update(
    productId: string,
    updateProductSnapshotDto: UpdateProductSnapshotDto,
  ) {
    return this.productSnapshotRepository.upsert(
      productId,
      updateProductSnapshotDto,
    );
  }

  remove(productId: string) {
    return this.productSnapshotRepository.delete(productId);
  }
}
