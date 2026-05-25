import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { Option } from '../entities/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class OptionRepository extends BaseRepository<Option> {
  constructor(
    @InjectRepository(Option)
    protected readonly repository: Repository<Option>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  findOne(id: string, manager?: EntityManager): Promise<Option> {
    const repo = manager ? manager.getRepository(Option) : this.repository;

    return repo.findOneOrFail({
      where: { id },
      relations: ['values'],
    });
  }
}
