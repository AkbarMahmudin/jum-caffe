import { PartialType } from '@nestjs/swagger';
import { CreateProductOptionSnapshotDto } from './create-product-option-snapshot.dto';

export class UpdateProductOptionSnapshotDto extends PartialType(
  CreateProductOptionSnapshotDto,
) {}
