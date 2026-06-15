import { AbstractRedisRepository } from '@jum-caffe/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PromoReservationCache extends AbstractRedisRepository<string> {}
