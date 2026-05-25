import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { OutletRepository } from './repositories/outlet.repository';
import { QueryParamsDto } from './dto/query-params.dto';
import { ILike } from 'typeorm';

@Injectable()
export class OutletService {
  constructor(private readonly outletRepository: OutletRepository) {}

  create(createOutletDto: CreateOutletDto) {
    return this.outletRepository.create({
      name: createOutletDto.name,
      address: createOutletDto.address,
      location: this.outletRepository.buildGeoPoint(
        createOutletDto.latitude,
        createOutletDto.longitude,
      ),
    });
  }

  async findAll(query: QueryParamsDto) {
    const { latitude, longitude, radius = 5000, search } = query;

    /**
     * 🔥 CASE 1: Nearby search
     */
    if ((latitude && !longitude) || (!latitude && longitude)) {
      throw new BadRequestException(
        'latitude and longitude must be provided together',
      );
    }

    if (latitude && longitude) {
      const { entities } = await this.outletRepository.findNearby({
        latitude,
        longitude,
        radius,
        search,
      });

      return entities;
    }

    return this.outletRepository.findAll({
      where: {
        name: search ? ILike(`%${search}%`) : undefined,
      },
    });
  }

  findOne(id: string) {
    return this.outletRepository.findOne(id);
  }

  update(
    id: string,
    { latitude, longitude, ...updateOutletDto }: UpdateOutletDto,
  ) {
    const payload: Partial<UpdateOutletDto & { location: any }> =
      updateOutletDto;

    if (latitude && longitude) {
      payload.location = this.outletRepository.buildGeoPoint(
        latitude,
        longitude,
      );
    }

    return this.outletRepository.update(id, payload);
  }

  async remove(id: string) {
    const removed = await this.outletRepository.delete(id);

    if (!removed) {
      throw new UnprocessableEntityException('Failed to deleted outlet');
    }

    return removed;
  }
}
