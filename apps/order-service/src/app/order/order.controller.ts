import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Query,
  Put,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiConsumes } from '@nestjs/swagger';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body()
    createOrderDto: CreateOrderDto,
  ) {
    const order = await this.orderService.create(createOrderDto);

    return {
      message: 'Order created successfully',
      data: {
        id: order.id,
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

  @Put(':id/status')
  @ApiConsumes('application/x-www-form-urlencoded', 'application/json')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { status }: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, status);
  }
}
