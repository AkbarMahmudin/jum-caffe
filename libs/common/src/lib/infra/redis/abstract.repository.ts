import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';

export abstract class AbstractRedisRepository<T> {
  protected logger: Logger = new Logger();

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async create(key: string, document: T, ttl?: number) {
    const keyExists = await this.cacheManager.get(key);

    if (keyExists) {
      throw new ConflictException('Document already exists.');
    }

    const value =
      typeof document === 'string' ? document : JSON.stringify(document);

    await this.cacheManager.set(key, value, ttl);

    return document;
  }

  async findOne(key: string) {
    const document = await this.cacheManager.get(key);

    if (!document) {
      return;
    }

    return JSON.parse(document as string) as T;
  }

  async findOneOrFail(key: string) {
    const document = await this.cacheManager.get(key);

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    return JSON.parse(document as string) as T;
  }

  async findOneAndUpdate(key: string, updateData: T) {
    const document = await this.cacheManager.get(key);

    if (!document) {
      return;
    }

    const value =
      typeof updateData === 'string' ? updateData : JSON.stringify(updateData);

    await this.cacheManager.set(key, value);

    return !!document;
  }

  async findOneAndUpdateOrFail(key: string, updateData: T) {
    const document = await this.cacheManager.get(key);

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    const value =
      typeof updateData === 'string' ? updateData : JSON.stringify(updateData);

    await this.cacheManager.set(key, value);

    return !!document;
  }

  async findOneAndDelete(key: string) {
    const document = await this.cacheManager.get(key);

    if (!document) {
      return;
    }

    await this.cacheManager.del(key);

    return !!document;
  }

  async findOneAndDeleteOrFail(key: string) {
    const document = await this.cacheManager.get(key);

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    await this.cacheManager.del(key);

    return !!document;
  }
}
