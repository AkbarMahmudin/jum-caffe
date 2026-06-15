import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { PromoReservation } from './promo-reservation.provider';

@Injectable()
export class PromoReservationExpired implements OnModuleInit {
  private client!: RedisClientType;

  constructor(
    private readonly promoReservation: PromoReservation,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const host = this.config.get('REDIST_HOST', 'localhost');
    const port = this.config.get('REDIS_PORT', 6379);

    this.client = createClient({
      url: `redis://${host}:${port}`,
    });

    await this.client.connect();

    await this.client.configSet(
      'notify-keyspace-events',

      'Ex',
    );

    await this.client.subscribe(
      '__keyevent@0__:expired',

      async (key) => {
        await this.handle(key);
      },
    );
  }

  private async handle(key: string) {
    if (!key.startsWith('promo:reservation:')) {
      return;
    }

    const reservationId = key.replace('promo:reservation:', '');

    await this.promoReservation.release(reservationId);
  }
}
