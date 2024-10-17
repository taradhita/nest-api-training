import {
  Response,
  TransformInterceptor,
} from '@/common/interceptors/transform.interceptor';
import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransactionInterceptor<T> extends TransformInterceptor<T> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data: {
            id: data.id,
            transaction_number: data.transaction_number,
            total_price: data.total_price,
            user_id: data.user_id,
            payment_status: data.payment_status,
            products: data.transactionDetails.map((detail) => {
              return {
                id: detail.product.id,
                name: detail.product.name,
                description: detail.product.description,
                quantity: detail.quantity,
                price: detail.price,
                categories: detail.product.categories?.map(
                  (category) => category.name,
                ),
              };
            }),
          },
        };
      }),
    );
  }
}
