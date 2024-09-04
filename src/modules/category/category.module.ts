import { Module, Scope } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaModule } from 'src/providers/database/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/app/http/exceptions/http.exception';
@Module({
  imports: [PrismaModule],
  providers: [
    CategoryService,
    {
      provide: APP_FILTER,
      scope: Scope.REQUEST,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
