import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationDto } from '@/common/dto/pagination.dto';

export const QueryPagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10 } = request.query;

    // Create a PaginationDto instance and return it
    return {
      page: Number(page),
      limit: Number(limit),
    };
  },
);
