/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
} from 'typeorm';

@Catch()
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('Exception caught by TypeOrmExceptionFilter:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let error = 'InternalServerError';

    /**
     * 1. TYPEORM: Duplicate / Constraint Error
     */
    if (exception instanceof QueryFailedError) {
      const driverError: any = exception.driverError;

      // PostgreSQL unique violation
      if (driverError.code === '23505') {
        status = HttpStatus.CONFLICT;
        error = 'ConflictException';
        message = this.parseDuplicateError(driverError.detail);
      }

      // Foreign key violation
      else if (driverError.code === '23503') {
        status = HttpStatus.BAD_REQUEST;
        error = 'ForeignKeyViolation';
        message = 'Invalid reference to related resource';
      } else {
        status = HttpStatus.BAD_REQUEST;
        error = 'QueryFailedError';
        message = driverError.detail || exception.message;
      }
    } else if (exception instanceof EntityNotFoundError) {
      /**
       * 2. TYPEORM: Entity Not Found
       */
      status = HttpStatus.NOT_FOUND;
      error = 'NotFoundException';
      message = 'Data not found';
    } else if (exception instanceof EntityPropertyNotFoundError) {
      status = HttpStatus.BAD_REQUEST;
      error = 'BadRequestException';
      message = exception.message;
    } else if (
      /**
       * 3. VALIDATION ERROR (class-validator)
       */
      exception?.response?.message &&
      Array.isArray(exception.response.message)
    ) {
      status = HttpStatus.BAD_REQUEST;
      error = 'ValidationError';
      message = exception.response.message;
    } else if (exception?.status) {
      /**
       * 4. DEFAULT HTTP EXCEPTION
       */
      status = exception.status;
      error = exception.name || 'HttpException';
      message = exception.response?.message || exception.message;
    } else {
      /**
       * 5. FALLBACK
       */
      message = exception?.message || message;
    }

    return response.status(status).json({
      success: false,
      statusCode: status,
      error,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Parse duplicate error message biar lebih readable
   */
  private parseDuplicateError(detail: string) {
    // Example:
    // Key (email)=(test@mail.com) already exists.

    const match = detail?.match(/\((.*?)\)=\((.*?)\)/);

    if (match) {
      const field = match[1];
      const value = match[2];
      return `${field} '${value}' already exists`;
    }

    return 'Duplicate data';
  }
}
