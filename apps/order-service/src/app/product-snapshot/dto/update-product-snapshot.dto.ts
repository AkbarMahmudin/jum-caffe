import { PartialType } from '@nestjs/swagger';
import { CreateProductSnapshotDto } from './create-product-snapshot.dto';

export class UpdateProductSnapshotDto extends PartialType(
  CreateProductSnapshotDto,
) {}
