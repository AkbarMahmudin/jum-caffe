import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  Logger,
} from '@nestjs/common';
import { PromoService } from './promo.service';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { ApplyPromoDto } from './dto/apply-promo.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RmqService, Roles, UserRole } from '@jum-caffe/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PaymentEvent } from './event/payment.event';

@Controller()
@ApiBearerAuth()
export class PromoController {
  private readonly logger = new Logger(PromoController.name);

  constructor(
    private readonly promoService: PromoService,
    private readonly rmqService: RmqService,
  ) {}

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

  @Get('available')
  async findAvailable() {
    return this.promoService.findAvailable();
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

  @Post('calculate')
  async calculate(@Body() ApplyPromoDto: ApplyPromoDto) {
    return this.promoService.calculate(ApplyPromoDto);
  }

  @Post('reserve')
  async reserve(@Body() applyPromoDto: ApplyPromoDto) {
    return this.promoService.reserve(applyPromoDto);
  }

  @EventPattern('payment.updated')
  async commit(
    @Payload() { eventId, payload: payment }: PaymentEvent,
    @Ctx() ctx: RmqContext,
  ) {
    this.logger.log(`Received event: payment.updated (${eventId})`);

    if (payment.status === 'paid') {
      await this.promoService.commit(payment.orderId);

      this.rmqService.ack(ctx);
    }
  }
}
