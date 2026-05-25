import {
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repositories/product.repository';
import { QueryParamsDto } from './dto/query-params.dto';
import { FindManyOptions, ILike } from 'typeorm';
import { ProductCache } from './cache/product.cache';
import { Product } from './entities/product.entity';
import { PRODUCT_SERVICE } from '@jum-caffe/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductEvent } from './event/product.event';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private readonly cacheKey: string = 'product';

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productCache: ProductCache,
    @Inject(PRODUCT_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create({ categoryId, ...createProductDto }: CreateProductDto) {
    const product = await this.productRepository.create({
      ...createProductDto,
      category: { id: categoryId },
    });

    // Clear cache after create new product
    if (product) {
      await this.productCache.findOneAndDelete(this.cacheKey);
    }

    // Emit event to rmq
    const eventType = 'product.created';
    const event = new ProductEvent(eventType, product);
    await lastValueFrom(this.client.emit(eventType, event));

    return product;
  }

  async findAll(query: QueryParamsDto) {
    const { search, categoryId, limit, sortBy, sort, outletId } = query;
    const cacheKey = outletId
      ? `${this.cacheKey}:outlet:${outletId}`
      : this.cacheKey;
    const hasNoFilters = !search && !categoryId && !limit && !sortBy && !sort;

    // Get from cache
    if (hasNoFilters) {
      const cachedProducts = await this.productCache.findOne(cacheKey);

      this.logger.log('Get from cache');

      if (cachedProducts) return cachedProducts;
    }

    this.logger.log('Get from db');

    const criteria = {
      where: {
        name: search ? (outletId ? search : ILike(`%${search}%`)) : undefined,
        category: categoryId ? { id: categoryId } : undefined,
      },
      take: limit ?? undefined,
      order: {
        ...(outletId
          ? ({
              'category.name': 'ASC',
            } as unknown as FindManyOptions<Product>['order'])
          : { category: { name: 'ASC' } }),
        [sortBy ?? 'createdAt']: sort?.toUpperCase() ?? 'DESC',
      },
    } as any;

    // Get from DB
    const products = outletId
      ? await this.productRepository.findAllWithOutlet(outletId, criteria)
      : await this.productRepository.findAll(criteria);

    // Store to redis for cache
    if (hasNoFilters) {
      const expireTime = 7 * 24 * 60 * 60 * 1000;
      await this.productCache.create(cacheKey, products, expireTime);
    }

    return products;
  }

  findOne(id: string) {
    return this.productRepository.findOne(id);
  }

  async update(
    id: string,
    { categoryId, ...updateProductDto }: UpdateProductDto,
  ) {
    const productUpdated = await this.productRepository.update(id, {
      ...updateProductDto,
      ...(categoryId && { category: { id: categoryId } }),
    });

    // Store to redis for cache
    await this.productCache.findOneAndDelete(this.cacheKey);

    // Emit event to rmq
    const eventType = 'product.updated';
    const event = new ProductEvent(eventType, productUpdated);
    await lastValueFrom(this.client.emit(eventType, event));

    return productUpdated;
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne(id);

    const removed = await this.productRepository.delete(id);
    if (!removed) {
      throw new UnprocessableEntityException('Failed to deleted product');
    }

    // Remove product from cache
    await this.productCache.deleteBy(this.cacheKey, product);

    // Emit event to rmq
    const eventType = 'product.deleted';
    const event = new ProductEvent(eventType, { id });

    await lastValueFrom(this.client.emit(eventType, event));

    return removed;
  }

  async attachOptions(id: string, optionIds: string[]) {
    const product = await this.productRepository.attachOptions(id, optionIds);

    return product;
  }
}
