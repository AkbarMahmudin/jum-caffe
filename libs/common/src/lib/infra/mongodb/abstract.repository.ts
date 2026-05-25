import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import {
  QueryFilter as FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  QueryOptions,
  Error,
  CastError,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {
    this.onCastError = this.onCastError.bind(this);
  }

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
    fields?: string,
  ): Promise<TDocument | undefined> {
    try {
      const document = await this.model
        .findOne(filterQuery, {}, { lean: true, ...options })
        .select(fields as any);

      if (!document) {
        this.logger.warn(
          `${this.model.modelName} not found with filterQuery:`,
          filterQuery,
        );
        return;
      }

      return document as TDocument;
    } catch (err) {
      this.onCastError(err as CastError);
      return undefined;
    }
  }

  async findOneOrFail(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
    fields?: string,
  ): Promise<TDocument | undefined> {
    try {
      const document = await this.model
        .findOne(filterQuery, {}, { lean: true, ...options })
        .select(fields as any);

      if (!document) {
        this.logger.warn(
          `${this.model.modelName} not found with filterQuery:`,
          filterQuery,
        );
        throw new NotFoundException(`${this.model.modelName} not found.`);
      }

      return document as TDocument;
    } catch (err) {
      this.onCastError(err as CastError);
      return undefined;
    }
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        lean: true,
        new: true,
      })
      .catch(this.onCastError);

    if (!document) {
      this.logger.warn(
        `${this.model.modelName} not found with filterQuery:`,
        filterQuery,
      );
      throw new NotFoundException(`${this.model.modelName} not found.`);
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(
    filterQuery: FilterQuery<TDocument>,
    options?: QueryOptions,
    fields?: string,
  ) {
    return this.model
      .find(filterQuery, {}, { lean: true, ...options })
      .select(fields as any);
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model
      .findOneAndDelete(filterQuery, {})
      .catch(this.onCastError);

    if (!document) {
      this.logger.warn(
        `${this.model.modelName} not found with filterQuery:`,
        filterQuery,
      );
      throw new NotFoundException(`${this.model.modelName} not found.`);
    }

    return document;
  }

  async count(filterQuery: FilterQuery<TDocument>) {
    return this.model.countDocuments(filterQuery);
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }

  async checkExist(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (document) {
      throw new ConflictException(`${this.model.modelName} already exists.`);
    }

    return !!document;
  }

  onCastError(err: Error.CastError) {
    if (err instanceof Error.CastError) {
      this.logger.error(err);
      throw new NotFoundException('Error parsing ObjectId.');
    }
    throw err;
  }
}
