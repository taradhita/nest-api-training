import { Module, Scope } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../exceptions/http.exception';
import { ProductModule } from '@/modules/product/product.module';
import { ProductController } from './product/product.controller';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { TransactionController } from './transaction/transaction.controller';

@Module({
  imports: [AuthModule, CategoryModule, ProductModule, TransactionModule],
  controllers: [
    AuthController,
    CategoryController,
    ProductController,
    TransactionController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class HttpV1Module {}
