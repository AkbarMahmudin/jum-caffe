import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@jum-caffe/common';
import { User } from '../entities/user.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, SaveOptions } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected logger: Logger = new Logger();

  constructor(
    @InjectModel(User.name) userModel: Model<User>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }

  async create(document: User, options?: SaveOptions): Promise<User> {
    await this.checkExist({ email: document.email });
    return super.create(document, options);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.findOneOrFail({ email });
  }
}
