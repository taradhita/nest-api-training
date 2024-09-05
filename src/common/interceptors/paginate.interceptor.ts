import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

@Injectable()
export class PaginateInterceptor<T>
  implements NestInterceptor<T, PaginatedResult<T>>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Check if the response contains meta field for pagination
        if (data && data.meta) {
          return {
            data: data.data,
            meta: data.meta,
          };
        }
        return data;
      }),
    );
  }
}
