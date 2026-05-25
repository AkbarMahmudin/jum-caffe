import { Injectable } from '@nestjs/common';
import { CreateProductOptionSnapshotDto } from './dto/create-product-option-snapshot.dto';
import { ProductOptionSnapshotRepository } from './repositories/product-option-snapshot.repository';

@Injectable()
export class ProductOptionSnapshotService {
  constructor(
    private readonly productSnapshotRepository: ProductOptionSnapshotRepository,
  ) {}

  async upsert(
    createProductOptionSnapshotDto: CreateProductOptionSnapshotDto[],
  ) {
    return this.productSnapshotRepository.upsert(
      createProductOptionSnapshotDto,
    );
  }

  async delete(optionId: string) {
    return this.productSnapshotRepository.deleteByOptionId(optionId);
  }
}
