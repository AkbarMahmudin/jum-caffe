import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager, Repository } from 'typeorm';
import { OptionValue } from '../entities/option-value.entity';

@Injectable()
export class OptionValueRepository extends BaseRepository<OptionValue> {
  constructor(
    @InjectRepository(OptionValue)
    protected readonly repository: Repository<OptionValue>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  async removeByOptionId(
    optionId: string,
    manager?: EntityManager,
  ): Promise<void> {
    await this.getRepo(manager).delete({ option: { id: optionId } });
  }

  async createMany(
    optionId: string,
    values: DeepPartial<OptionValue>[],
    manager?: EntityManager,
  ): Promise<OptionValue[]> {
    const repo = this.getRepo(manager);
    const entities = values.map((value) =>
      repo.create({
        name: value.name,
        additionalPrice: value.additionalPrice,
        option: { id: optionId },
      }),
    );
    return repo.save(entities);
  }
}
