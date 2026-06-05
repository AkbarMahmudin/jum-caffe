import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  Logger,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { PaymentEvent } from './event/payment.event';
import { OrderStatus } from '../common/enum/order-status.enum';
import { RmqService } from '@jum-caffe/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@ApiBearerAuth()
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: RmqService,
  ) {}

  @Post()
  async create(
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    const { payment, ...order } =
      await this.orderService.create(createOrderDto);

    return {
      message: 'Order created successfully',
      data: {
        id: order.id,
        payment,
      },
    };
  }

  @Get()
  findAll(@Query() query: QueryParamsDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderService.findOne(id);
  }

  // ! DRAFT
  // @Put(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateOrderDto: UpdateOrderDto,
  // ) {
  //   return this.orderService.update(id, updateOrderDto);
  // }

  @EventPattern('payment.updated')
  async updateStatus(
    @Payload() { payload: payment }: PaymentEvent,
    @Ctx() ctx: RmqContext,
  ) {
    this.logger.log(`Received event: payment.updated (${payment.orderId})`);

    if (payment.status !== OrderStatus.PENDING) {
      await this.orderService.updateStatus(
        payment.orderId,
        payment.status as OrderStatus,
      );
    }

    this.rmqService.ack(ctx);
  }
}
