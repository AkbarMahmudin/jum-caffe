import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@jum-caffe/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class RefreshTokenRepository extends AbstractRepository<RefreshToken> {
  protected logger: Logger = new Logger();

  constructor(
    @InjectModel(RefreshToken.name) userModel: Model<RefreshToken>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
