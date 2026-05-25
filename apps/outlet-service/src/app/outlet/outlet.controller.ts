import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { OutletService } from './outlet.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller('')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Post()
  async create(@Body() createOutletDto: CreateOutletDto) {
    const newOutlet = await this.outletService.create(createOutletDto);

    return {
      message: 'Outlet created successfully',
      data: {
        id: newOutlet.id,
      },
    };
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.outletService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.outletService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOutletDto: UpdateOutletDto,
  ) {
    await this.outletService.update(id, updateOutletDto);

    return { message: 'Outlet updated successfully' };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.outletService.remove(id);

    return { message: 'Outlet deleted successfully' };
  }
}
