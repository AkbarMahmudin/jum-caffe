import { Controller, Logger } from '@nestjs/common';
import { OutletProductService } from './outlet-product.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@jum-caffe/common';
import { OutletProductStatusUpdatedEvent } from './event/outlet-product-status-updated.event';
import { OutletProductAddedEvent } from './event/outlet-product-added.event';

@Controller()
export class OutletProductConsumer {
  private readonly logger = new Logger(OutletProductConsumer.name);

  constructor(
    private readonly outletProductService: OutletProductService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('outlet.product.added')
  async upsert(
    @Payload()
    payload: OutletProductAddedEvent,
    @Ctx() ctx: RmqContext,
  ) {
    const { eventId, eventType, payload: data } = payload;

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    await this.outletProductService.upsert(data.outletId, data.productIds);

    this.rmqService.ack(ctx);
  }

  @EventPattern('outlet.product.status.updated')
  async updateStatus(
    @Payload()
    payload: OutletProductStatusUpdatedEvent,
    @Ctx() ctx: RmqContext,
  ) {
    const { eventType, eventId, payload: data } = payload;

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    await this.outletProductService.updateStatus(
      data.outletId,
      data.productIds,
      data.isAvailable,
    );

    this.rmqService.ack(ctx);
  }
}
