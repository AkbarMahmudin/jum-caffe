import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { QueryParamsDto } from './dto/query-params.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('webhook')
  @ApiBody({ description: 'Midtrans webhook payload', type: Object })
  async webhook(@Body() payload: any) {
    return this.paymentService.handleWebhook(payload);
  }

  @Get()
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  findAll(@Query() query: QueryParamsDto) {
    return this.paymentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Get('order/:id')
  findByOrderId(
    @Param('id') orderId: string,
    @Query() query: Omit<QueryParamsDto, 'orderId'>,
  ) {
    return this.paymentService.findAll({
      ...query,
      orderId,
    });
  }

  @Post('order/:id/retry')
  reCreate(@Param('id') orderId: string) {
    return this.paymentService.reCreate(orderId);
  }
}
