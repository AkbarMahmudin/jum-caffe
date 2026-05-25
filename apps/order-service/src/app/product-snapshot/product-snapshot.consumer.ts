import { Controller } from '@nestjs/common';
import { ProductSnapshotService } from './product-snapshot.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { RmqService } from '@jum-caffe/common';
import { ProductEvent } from './event/product.event';

@Controller()
export class ProductSnapshotConsumer {
  private readonly logger = new Logger(ProductSnapshotConsumer.name);

  constructor(
    private readonly productSnapshotService: ProductSnapshotService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('product.created')
  async create(@Payload() payload: ProductEvent, @Ctx() ctx: RmqContext) {
    const { eventType, eventId, payload: product } = payload;

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    await this.productSnapshotService.create(this.parsePayload(product));

    this.rmqService.ack(ctx);
  }

  @EventPattern('product.updated')
  async update(@Payload() payload: ProductEvent, @Ctx() ctx: RmqContext) {
    const { eventType, eventId, payload: product } = payload;

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    await this.productSnapshotService.update(
      product.id,
      this.parsePayload(product),
    );

    this.rmqService.ack(ctx);
  }

  @EventPattern('product.deleted')
  async remove(
    @Payload() { payload: product }: ProductEvent,
    @Ctx() ctx: RmqContext,
  ) {
    this.logger.log(`Received event: product.deleted (${product.id})`);

    await this.productSnapshotService.remove(product.id);

    this.rmqService.ack(ctx);
  }

  private parsePayload(product: ProductEvent['payload']) {
    return {
      productId: product.id,
      name: product.name,
      basePrice: product.basePrice,
      isActive: product.isActive,
      version: product.version,
    };
  }
}
