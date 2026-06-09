import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public, Roles, UserRole } from '@jum-caffe/common';

@Controller('categories')
@Roles(UserRole.SuperAdmin)
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.categoryService.create(createCategoryDto);

    return {
      message: 'Category created successfully',
      data: { id: newCategory.id },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ security: [] })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ security: [] })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.categoryService.update(id, updateCategoryDto);

    return {
      message: 'Category updated successfully',
      data: { id },
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);

    return { message: 'Category deleted successfully', data: { id } };
  }
}
