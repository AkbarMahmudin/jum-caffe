/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

// import {
//   DEFAULT_PAGINATION_PAGE,
//   DEFAULT_PAGINATION_SIZE,
// } from '@utils/constant/pagination.constant';
// import { circularToJSON } from '../helper';
// import { BaseResource, Resource } from '../base-class/base.resource';

type Meta = {
  currentRecordCount: number;
  totalRecordCount: number;
  totalPage: number;
  currentPage: number;
  perPage: number;
  startOf: number;
};

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<T, any> {
  offset;

  /**
   * @property
   * @interface {string}
   * all query inserted when access endpoint
   */
  queryString = '';

  /**
   * endpoint url
   */
  pathname = '';

  /**
   * @property
   * @interface {Object}
   * all query inserted when access endpoint
   */
  query = {
    page: 1,
    limit: 10,
  };

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    this.query = request.query;

    return next.handle().pipe(
      map((resp) => {
        const { count, data = [], ...additionalMeta } = resp;

        // eslint-disable-next-line no-underscore-dangle
        this.queryString = request._parsedUrl.query || '';
        // eslint-disable-next-line no-underscore-dangle
        this.pathname = request._parsedUrl.pathname;

        // make to json serialize

        const meta = this.meta(count, data, additionalMeta);

        return { meta, data, links: this.links(meta) };
      }),
    );
  }

  /**
   * link of response
   * @param param0
   */
  private links({ currentPage, totalPage }: Meta) {
    // LINKS

    const self = () => this.linkQueries(currentPage);
    const prev = () => {
      const prevPage = +currentPage - 1;
      if (prevPage < 1) return undefined;

      return this.linkQueries(prevPage);
    };
    const next = () => {
      if (+currentPage >= +totalPage) return undefined;

      return this.linkQueries(+currentPage + 1);
    };

    const last = () => {
      if (!+totalPage) return undefined;
      return this.linkQueries(totalPage);
    };

    return {
      self: self(),
      prev: prev(),
      next: next(),
      last: last(),
    };
  }

  private linkQueries(itsPage: number): string {
    const updatedQuery = this.queryString.replace(
      `page=${this?.query?.page}`,
      `page=${itsPage}`,
    );

    if (!updatedQuery) return this.pathname;
    return `${this.pathname}?${updatedQuery}`;
  }

  /**
   * generate meta of response pagination
   * @param count
   * @param rows
   * @param additionalMeta
   */
  private meta(count, rows: any[], additionalMeta: any): Meta {
    // META
    const total: number =
      typeof count === 'object' ? count?.length || 0 : count;

    const page = this.query.page || 1;
    const limit = this.query.limit || 10;
    const totalPage = Math.ceil(total / +limit);

    const offset = limit * page - +limit || 0;

    return (
      (total >= 0 && {
        totalRecordCount: total,
        currentRecordCount: rows?.length || 0,
        totalPage: totalPage || 0,
        currentPage: +additionalMeta?.meta?.page || +page || 1,
        perPage: +limit || 0,
        startOf: (count && offset + 1) || 0,
        ...additionalMeta,
      }) ||
      undefined
    );
  }
}
