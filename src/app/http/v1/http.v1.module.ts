import { Module, Scope } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from 'src/modules/category/category.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../exceptions/http.exception';

@Module({
  imports: [AuthModule, CategoryModule],
  controllers: [AuthController, CategoryController],
  providers: [
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class HttpV1Module {}
