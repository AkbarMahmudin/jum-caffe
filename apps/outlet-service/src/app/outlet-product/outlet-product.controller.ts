import {
  Controller,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { OutletProductService } from './outlet-product.service';
import { CreateOutletProductDto } from './dto/create-outlet-product.dto';
import { UpdateOutletProductDto } from './dto/update-outlet-product.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles, UserRole } from '@jum-caffe/common';

@Controller()
@ApiBearerAuth()
@Roles(UserRole.SuperAdmin, UserRole.Admin)
export class OutletProductController {
  constructor(private readonly outletProductService: OutletProductService) {}

  @Post(':outletId/products')
  async upsert(
    @Param('outletId', ParseUUIDPipe) outletId: string,
    @Body() createOutletProductDto: CreateOutletProductDto,
  ) {
    await this.outletProductService.upsert(outletId, createOutletProductDto);

    return { message: 'Outlet products upserted successfully' };
  }

  @Put(':outletId/products/status')
  async updateStatus(
    @Param('outletId', ParseUUIDPipe) outletId: string,
    @Body() updateOutletProductDto: UpdateOutletProductDto,
  ) {
    await this.outletProductService.updateStatus(
      outletId,
      updateOutletProductDto,
    );

    return { message: 'Outlet product status updated successfully' };
  }
}
