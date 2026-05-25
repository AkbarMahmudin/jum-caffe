import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateOutletProductDto } from './dto/create-outlet-product.dto';
import { OutletProductRepository } from './repositories/outlet-product.repository';
import { ClientProxy } from '@nestjs/microservices';
import { OUTLET_SERVICE } from '@jum-caffe/common';
import { lastValueFrom } from 'rxjs';
import { OutletProductAddedEvent } from './event/outlet-product-added.event';
import { randomUUID } from 'crypto';
import { OutletProductStatusUpdatedEvent } from './event/outlet-product-status-updated.event';
import { UpdateOutletProductDto } from './dto/update-outlet-product.dto';
import { OutletProductEvent } from './event/outlet-product.event';

@Injectable()
export class OutletProductService {
  private readonly logger = new Logger(OutletProductService.name);

  constructor(
    @Inject(OUTLET_SERVICE)
    private readonly client: ClientProxy,
    private readonly outletProductRepository: OutletProductRepository,
  ) {}

  async upsert(
    outletId: string,
    createOutletProductDto: CreateOutletProductDto,
  ) {
    const currentDate = new Date().toISOString();
    const eventType = 'outlet.product.added';
    const eventPayload = {
      outletId,
      productIds: createOutletProductDto.productIds,
      assignedAt: currentDate,
    };

    const event = new OutletProductEvent(eventType, eventPayload);

    await lastValueFrom(this.client.emit(eventType, event));

    this.logger.log(`Send event: ${event.eventType} (${event.eventId})`);

    return this.outletProductRepository.createMany(
      outletId,
      createOutletProductDto.productIds,
    );
  }

  async updateStatus(
    outletId: string,
    { isAvailable, productIds }: UpdateOutletProductDto,
  ) {
    const outletProduct = await this.outletProductRepository.updateStatus(
      outletId,
      productIds,
      isAvailable,
    );
    const eventType = 'outlet.product.status.updated';

    const event: OutletProductStatusUpdatedEvent = {
      eventId: randomUUID(),
      eventType,
      eventVersion: '1.0',
      producer: OUTLET_SERVICE,
      payload: {
        outletId,
        productIds,
        isAvailable,
      },
    };

    await lastValueFrom(this.client.emit(eventType, event));

    return outletProduct;
  }
}
