import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
} from '@nestjs/swagger';
import { QueryParamsDto } from './dto/query-params.dto';
import { InternalApiGuard, Public } from '@jum-caffe/common';

@Controller()
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // TODO: Add authorization for internal services (order-service) to call this endpoint
  @Post()
  @UseGuards(InternalApiGuard)
  @ApiHeader({
    name: 'X-Service-Id',
    required: true,
    description: 'Service Identifier',
  })
  @ApiHeader({
    name: 'X-Timestamp',
    required: true,
    description: 'Timestamp request',
  })
  @ApiHeader({
    name: 'X-Signature',
    required: true,
    description: 'Service signature',
  })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('webhook')
  @Public()
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

  @Post('retry')
  reCreate(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.reCreate(createPaymentDto);
  }
}
