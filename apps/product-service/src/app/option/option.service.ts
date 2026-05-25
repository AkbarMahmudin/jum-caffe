import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { OptionRepository } from './repositories/option.repository';
import { OptionValueRepository } from './repositories/option-value.repository';
import { lastValueFrom } from 'rxjs';
import { PRODUCT_SERVICE } from '@jum-caffe/common';
import { ClientProxy } from '@nestjs/microservices';
import { ProductOptionEvent } from './event/product-option.event';

@Injectable()
export class OptionService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly optionValueRepository: OptionValueRepository,
    @Inject(PRODUCT_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(createOptionDto: CreateOptionDto) {
    const option = await this.optionRepository.create(createOptionDto);

    // Emit event to rmq
    const eventType = 'product.option.created';
    const event = new ProductOptionEvent(eventType, option);
    await lastValueFrom(this.client.emit(eventType, event));

    return option;
  }

  findAll() {
    return this.optionRepository.findAll();
  }

  findOne(id: string) {
    return this.optionRepository.findOne(id);
  }

  async update(id: string, { name, values }: UpdateOptionDto) {
    if (!values) {
      return this.optionRepository.update(id, { name });
    }

    await this.optionRepository.withTransaction(async (manager) => {
      await this.optionRepository.update(id, { name }, manager);
      await this.optionValueRepository.removeByOptionId(id, manager);
      await this.optionValueRepository.createMany(id, values, manager);
    });

    const option = await this.findOne(id);

    // Emit event to rmq
    const eventType = 'product.option.updated';
    const event = new ProductOptionEvent(eventType, option);
    await lastValueFrom(this.client.emit(eventType, event));

    return option;
  }

  async remove(id: string) {
    const removed = await this.optionRepository.delete(id);
    if (!removed) {
      throw new UnprocessableEntityException('Failed to remove option');
    }

    // Emit event to rmq
    const eventType = 'product.option.deleted';
    const event = new ProductOptionEvent(eventType, { id });
    await lastValueFrom(this.client.emit(eventType, event));

    return removed;
  }
}
