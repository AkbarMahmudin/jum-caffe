import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@jum-caffe/common';
import { Outlet } from '../entities/outlet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, Repository } from 'typeorm';

type FindNearbyOptions = {
  latitude: number;
  longitude: number;
  radius?: number;
  search?: string;
};

@Injectable()
export class OutletRepository extends BaseRepository<Outlet> {
  constructor(
    @InjectRepository(Outlet)
    protected readonly repository: Repository<Outlet>,
    protected readonly dataSource: DataSource,
  ) {
    super(repository, dataSource);
  }

  async findNearby({
    latitude,
    longitude,
    radius = 5000,
    ...options
  }: FindNearbyOptions) {
    const queryBuilder = await this.repository
      .createQueryBuilder('outlets')
      .addSelect(
        `
      ST_Distance(
        outlets.location,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
      )
    `,
        'distance',
      )
      .where(
        `
      ST_DWithin(
        outlets.location,
        ST_SetSRID(ST_MakePoint(:lng, :lat), 4326),
        :radius
      )
    `,
      )
      .setParameters({
        lat: latitude,
        lng: longitude,
        radius,
      });

    const { search } = options;

    if (search) {
      queryBuilder
        .where(
          `
        outlets.name ILIKE :search
      `,
        )
        .setParameters({
          search: `%${search}%`,
        });
    }

    return queryBuilder.orderBy('distance', 'ASC').take(20).getRawAndEntities();
  }

  buildGeoPoint(
    lat: number,
    lng: number,
  ):
    | DeepPartial<{
        type: 'Point';
        coordinates: [number, number];
      }>
    | undefined {
    return {
      type: 'Point',
      coordinates: [lng, lat],
    };
  }
}
