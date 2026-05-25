import { Injectable } from '@nestjs/common';
import { AbstractRedisRepository } from '@jum-caffe/common';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductCache extends AbstractRedisRepository<Product[]> {
  async upsert(key: string, product: Product) {
    const documents = await this.findOne(key);
    const expireTime = 10 * 1000;

    if (documents) {
      const dataIndex = documents.findIndex((doc) => doc.id === product.id);

      if (dataIndex !== -1) {
        documents.splice(dataIndex, 1, product);
      } else {
        documents.push(product);
      }

      return this.findOneAndUpdate(key, documents);
    }

    return this.create(key, [product], expireTime);
  }

  async deleteBy(key: string, product: Product) {
    const documents = await this.findOne(key);

    if (documents) {
      const dataIndex = documents.findIndex((doc) => doc.id === product.id);
      if (dataIndex !== -1) {
        documents.splice(dataIndex, 1);
      }

      return this.findOneAndUpdate(key, documents);
    }
  }
}
