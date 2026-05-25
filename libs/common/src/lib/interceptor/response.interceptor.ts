/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        /**
         * Support custom response dari service:
         * return { data, meta, message }
         */
        if (this.isCustomResponse(data)) {
          return {
            success: true,
            statusCode,
            message: data.message ?? 'Success',
            data: data.data,
            meta: data.meta ?? null,
            path: request.url,
            timestamp: new Date().toISOString(),
          };
        }

        /**
         * Default mapping
         */
        return {
          success: true,
          statusCode: 200,
          message: 'Success',
          data,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  /**
   * Detect apakah response sudah dibungkus custom
   */
  private isCustomResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      ('data' in data || 'meta' in data || 'message' in data)
    );
  }
}
