import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { Order } from '../entities/order.entity';
import {
  DataSource,
  EntityManager,
  QueryDeepPartialEntity,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from '../entities/order-item.entity';
import { OrderItemCustomization } from '../entities/order-item-customization.entity';
import { OrderStatus } from '../../common/enum/order-status.enum';
import { OrderStatusHistory } from '../entities/order-status-history.entity';

@Injectable()
export class OrderRepository extends BaseRepository<Order> {
  constructor(
    @InjectRepository(Order)
    protected readonly repository: Repository<Order>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  async findOne(id: string, manager?: EntityManager): Promise<Order> {
    const repo = this.getRepo(manager);
    const order = await repo.findOneOrFail({
      where: { id },
      relations: {
        items: {
          customizations: true,
        },
        histories: true,
      },
    });

    return order;
  }

  async findOneWithUser(
    id: string,
    userId: string,
    manager?: EntityManager,
  ): Promise<Order> {
    const repo = this.getRepo(manager);
    const order = await repo.findOneOrFail({
      where: { id, userId },
      relations: {
        items: {
          customizations: true,
        },
        histories: true,
      },
    });

    return order;
  }

  async update(
    id: string,
    data: QueryDeepPartialEntity<Order>,
    manager?: EntityManager,
  ): Promise<Order> {
    return this.withTransaction(async (manager) => {
      // 1. Update Order
      await manager.update(Order, id, {
        outletId: data.outletId,
        source: data.source,
        totalPrice: data.totalPrice,
      });

      // 2. Remove Old Items
      await manager.delete(OrderItem, {
        order: { id },
      });

      // 3. Recreate Items
      const items = Array.isArray(data.items)
        ? (data.items as Array<QueryDeepPartialEntity<OrderItem>>)
        : [];

      for (const item of items) {
        const orderItem = await manager.save(OrderItem, {
          order: { id },
          productId: item.productId as string,
          quantity: item.quantity as number,
          basePrice: item.basePrice as number,
          subTotal: item.subTotal as number,
        });

        const customizations = Array.isArray(item.customizations)
          ? item.customizations
          : [];

        if (customizations.length) {
          await manager.insert(
            OrderItemCustomization,
            customizations.map((customization) => ({
              orderItem: { id: orderItem.id },
              optionValueName: customization.optionValueName as string,
              optionName: customization.optionName as string,
              additionalPrice: customization.additionalPrice as number,
            })),
          );
        }
      }

      // 4. Return order
      return manager.findOneOrFail(Order, {
        where: { id },
        relations: {
          items: {
            customizations: true,
          },
        },
      });
    });
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    manager?: EntityManager,
  ): Promise<Order> {
    const repo = this.getRepo(manager);
    const order = await repo.findOneOrFail({
      where: { id },
      relations: {
        histories: true,
      },
    });

    order.status = status;

    // Add history
    order.histories.push({ status } as OrderStatusHistory);

    return repo.save(order, { reload: true });
  }
}
