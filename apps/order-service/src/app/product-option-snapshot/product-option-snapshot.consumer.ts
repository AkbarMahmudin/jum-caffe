import { Controller, Logger } from '@nestjs/common';
import { ProductOptionSnapshotService } from './product-option-snapshot.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@jum-caffe/common';
import { ProductOptionEvent } from './event/product-option.event';
import { CreateProductOptionSnapshotDto } from './dto/create-product-option-snapshot.dto';

@Controller()
export class ProductOptionSnapshotConsumer {
  private readonly logger = new Logger(ProductOptionSnapshotConsumer.name);

  constructor(
    private readonly productOptionSnapshotService: ProductOptionSnapshotService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('product.option.created')
  async handleProductOptionCreated(
    @Payload() payload: ProductOptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    const { eventId, eventType, payload: data } = payload;
    const option = this.parseOption(data);

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    if (!data.values) {
      return;
    }

    if (option) await this.productOptionSnapshotService.upsert(option);

    this.rmqService.ack(ctx);
  }

  @EventPattern('product.option.updated')
  async handleProductOptionUpdated(
    @Payload() payload: ProductOptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    const { eventId, eventType, payload: data } = payload;
    const option = this.parseOption(data);

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    if (!data.values) {
      return;
    }

    if (option) await this.productOptionSnapshotService.upsert(option);

    this.rmqService.ack(ctx);
  }

  @EventPattern('product.option.deleted')
  async handleProductOptionDeleted(
    @Payload() payload: ProductOptionEvent,
    @Ctx() ctx: RmqContext,
  ) {
    const { eventId, eventType, payload: data } = payload;

    this.logger.log(`Received event: ${eventType} (${eventId})`);

    await this.productOptionSnapshotService.delete(data.id);

    this.rmqService.ack(ctx);
  }

  private parseOption(
    option: ProductOptionEvent['payload'],
  ): CreateProductOptionSnapshotDto[] | undefined {
    if (!option?.values?.length) {
      return;
    }

    return option?.values?.map((optionValue) => ({
      optionId: option.id,
      optionName: option.name,
      optionValueId: optionValue.id,
      optionValueName: optionValue.name,
      additionalPrice: optionValue.additionalPrice,
    }));
  }
}
