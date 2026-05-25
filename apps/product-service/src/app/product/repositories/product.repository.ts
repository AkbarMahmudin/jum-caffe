import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/browser';
import { Option } from '../../option/entities/option.entity';

@Injectable()
export class ProductRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    protected readonly repository: Repository<Product>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  findAll(
    options?: FindManyOptions<Product>,
    manager?: EntityManager,
  ): Promise<Product[]> {
    return this.getRepo(manager).find({
      ...options,
      relations: {
        category: true,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        basePrice: true,
        category: {
          id: true,
          name: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, manager?: EntityManager): Promise<Product> {
    return this.getRepo(manager).findOneOrFail({
      where: { id },
      relations: {
        category: true,
        options: {
          values: true,
        },
      },
      select: {
        category: {
          id: true,
          name: true,
        },
        options: {
          id: true,
          name: true,
          values: {
            id: true,
            name: true,
            additionalPrice: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: QueryDeepPartialEntity<Product>,
    manager?: EntityManager,
  ): Promise<Product> {
    const repo = this.getRepo(manager);
    const product = await repo.findOneOrFail({ where: { id } });

    product.version = (product.version || 1) + 1; // Increment version

    await repo.update(id, {
      ...data,
      version: product.version,
    });

    return this.findOne(id, manager);
  }

  async attachOptions(
    id: string,
    optionsIds: string[],
    manager?: EntityManager,
  ) {
    const product = await this.getRepo(manager).findOneOrFail({
      where: { id },
    });

    product.options = optionsIds.map((id) => ({
      id,
    })) as Option[];

    await this.getRepo(manager).save(product);

    return this.findOne(id, manager);
  }

  async findAllWithOutlet(
    outletId: string,
    options?: FindManyOptions<Product>,
    manager?: EntityManager,
  ): Promise<Product[]> {
    const queryBuilder = this.getRepo(manager)
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .innerJoin(
        'outlet_products',
        'op',
        `
          op.productId = products.id
          AND op.outletId = :outletId
          AND op.deletedAt IS NULL
        `,
        {
          outletId,
        },
      )
      .select([
        'products.id',
        'products.name',
        'products.imageUrl',
        'products.basePrice',
        'category.id',
        'category.name',
        'products.createdAt',
        'products.updatedAt',
      ]);

    if (options?.where) {
      const where = options.where as FindOptionsWhere<Product>;

      if (where.name) {
        queryBuilder.andWhere('products.name ILIKE :name', {
          name: `%${where.name as string}%`,
        });
      }
      if (
        where.category &&
        typeof where.category === 'object' &&
        'id' in where.category
      ) {
        queryBuilder.andWhere('category.id = :categoryId', {
          categoryId: where.category.id,
        });
      }
    }

    if (options?.order) {
      for (const [key, value] of Object.entries(options.order)) {
        const columnKey = key.includes('.') ? key : `products.${key}`;
        queryBuilder.addOrderBy(columnKey, value as 'ASC' | 'DESC');
      }
    }

    if (options?.take) {
      queryBuilder.take(options.take);
    }

    return await queryBuilder.getMany();
  }
}
