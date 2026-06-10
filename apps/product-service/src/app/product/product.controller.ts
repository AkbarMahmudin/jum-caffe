import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { AddProductOptions } from './dto/add-product-options.dto';
import { Public, Roles, UserRole } from '@jum-caffe/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller()
@Roles(UserRole.SuperAdmin)
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productService.create(createProductDto);

    return {
      message: 'Product created successfully',
      data: { id: newProduct.id },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ security: [] })
  findAll(@Query() query: QueryParamsDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ security: [] })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.update(id, updateProductDto);

    return { message: 'Product updated successfully', data: { id } };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productService.remove(id);

    return { message: 'Product deleted successfully', data: { id } };
  }

  @Put(':id/options')
  async attachOptions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addProductOptions: AddProductOptions,
  ) {
    return this.productService.attachOptions(id, addProductOptions.optionIds);
  }
}
