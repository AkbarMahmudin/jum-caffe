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
import { PromoService } from './promo.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { ReservePromoDto } from './dto/reserve-promo.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles, UserRole } from '@jum-caffe/common';

@Controller()
@ApiBearerAuth()
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Post()
  @Roles(UserRole.SuperAdmin)
  async create(@Body() createPromoDto: CreatePromoDto) {
    const promo = await this.promoService.create(createPromoDto);

    return {
      message: 'Promo created successfully',
      data: {
        id: promo.id,
      },
    };
  }

  @Get()
  @Roles(UserRole.SuperAdmin)
  findAll() {
    return this.promoService.findAll();
  }

  @Roles(UserRole.SuperAdmin)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.promoService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.SuperAdmin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePromoDto: UpdatePromoDto,
  ) {
    await this.promoService.update(id, updatePromoDto);

    return {
      message: 'Promo updated successfully',
      data: {
        id,
      },
    };
  }

  @Delete(':id')
  @Roles(UserRole.SuperAdmin)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.promoService.remove(id);

    return {
      message: 'Promo deleted successfully',
      data: {
        id,
      },
    };
  }

  @Get('available')
  async findAvailable() {
    return this.promoService.findAvailable();
  }

  @Post('calculate')
  async calculate(@Body() ApplyPromoDto: ApplyPromoDto) {
    return this.promoService.calculate(ApplyPromoDto);
  }

  @Post('reserve')
  async reserve(@Body() applyPromoDto: ApplyPromoDto) {
    return this.promoService.reserve(applyPromoDto);
  }
}
