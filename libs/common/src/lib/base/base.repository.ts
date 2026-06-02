/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T extends ObjectLiteral> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly dataSource?: DataSource,
  ) {}

  /**
   * Get repository (normal / transactional)
   */
  protected getRepo(manager?: EntityManager): Repository<T> {
    return manager
      ? manager.getRepository<T>(this.repository.target)
      : this.repository;
  }

  async create(data: DeepPartial<T>, manager?: EntityManager): Promise<T> {
    const repo = this.getRepo(manager);

    let entity = repo.create(data);
    entity = await repo.save(entity);

    return this.findOne(entity['id']);
  }

  async findAll(
    options?: FindManyOptions<T>,
    manager?: EntityManager,
  ): Promise<T[]> {
    return this.getRepo(manager).find(options);
  }

  async findOne(id: string, manager?: EntityManager): Promise<T> {
    const options: FindOneOptions<T> = {
      where: { id: id as unknown as T[keyof T] },
      relations: ['logs'],
    };

    return this.getRepo(manager).findOneOrFail(options);
  }

  async update(
    id: string,
    data: QueryDeepPartialEntity<T>,
    manager?: EntityManager,
  ): Promise<T> {
    const repo = this.getRepo(manager);
    await repo.update(id, data);
    return this.findOne(id, manager);
  }

  async delete(id: string, manager?: EntityManager): Promise<boolean> {
    await this.findOne(id, manager);

    const { affected } = await this.getRepo(manager).softDelete(id);
    return !!affected;
  }

  /**
   * 🔥 Transaction Helper
   */
  async withTransaction<R>(
    fn: (manager: EntityManager) => Promise<R>,
  ): Promise<R> {
    if (!this.dataSource) {
      throw new Error('DataSource is required for transactions');
    }

    return this.dataSource.transaction(async (manager) => {
      return fn(manager);
    });
  }

  /**
   * 🔥 Manual Transaction (Advanced Control)
   */
  async createQueryRunner(): Promise<QueryRunner> {
    if (!this.dataSource) {
      throw new Error('DataSource is required for manual transactions');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }
}
