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
import { OptionService } from './option.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Public } from '@jum-caffe/common';

@Controller('options')
@ApiBearerAuth()
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  async create(@Body() createOptionDto: CreateOptionDto) {
    const newOption = await this.optionService.create(createOptionDto);

    return {
      message: 'Option created successfully',
      data: { id: newOption.id },
    };
  }

  @Get()
  @Public()
  @ApiOperation({ security: [] })
  findAll() {
    return this.optionService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ security: [] })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.optionService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    await this.optionService.update(id, updateOptionDto);
    return { message: 'Option updated successfully', data: { id } };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.optionService.remove(id);
    return { message: 'Option removed successfully', data: { id } };
  }
}
