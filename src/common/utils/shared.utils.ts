import { PAGINATION_DEFAULTS } from '@/common/constants';
import { PaginationDto } from '@/common/dto/pagination.dto';

export const getPagination = (paginationDto: PaginationDto) => {
  const page = paginationDto?.page || PAGINATION_DEFAULTS.PAGE;
  const limit = paginationDto?.limit || PAGINATION_DEFAULTS.LIMIT;

  return { page, limit };
};
