import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../interfaces/paginated-result.interface';
import { PaginationResult } from 'prisma-paginate';

@Injectable()
export class PaginateInterceptor<T>
  implements NestInterceptor<T, PaginatedResult<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof PaginationResult) {
          return {
            data: data.result,
            meta: {
              current_page: data.page,
              last_page: data.totalPages,
              per_page: data.limit,
              total: data.count,
            },
          };
        }
      }),
    );
  }
}
