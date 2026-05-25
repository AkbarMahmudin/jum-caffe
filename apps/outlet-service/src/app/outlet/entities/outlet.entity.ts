import { BaseEntity } from '@jum-caffe/common';
import { Column, Entity, Index } from 'typeorm';

@Entity('outltets')
export class Outlet extends BaseEntity {
  @Column()
  name!: string;

  @Column('text', { nullable: true })
  address?: string;

  /**
   * Geometry Point (longitude, latitude)
   */
  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  location!: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };

  @Column('boolean', { default: true })
  isActive?: boolean;
}
