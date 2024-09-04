import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../providers/database/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Categories } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PAGINATION_DEFAULTS } from '../../common/constants';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prisma: PrismaService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.categories.create({
      data: createCategoryDto,
    });

    return {
      data: category,
    };
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<Categories>> {
    const page = paginationDto.page || PAGINATION_DEFAULTS.PAGE;
    const limit = paginationDto.limit || PAGINATION_DEFAULTS.LIMIT;
    const skip = (page - 1) * limit;
    const count = await this.prisma.categories.count();
    const data = await this.prisma.categories.findMany({
      skip: skip,
      take: limit,
    });

    this.logger.info(data);

    return {
      data,
      meta: {
        current_page: page,
        last_page: count > 0 ? Math.ceil(count / limit) : 1,
        per_page: limit,
        total: count,
      },
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findFirst({ where: { id } });

    return {
      data: category,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });

    return {
      data: category,
    };
  }

  remove(id: number) {
    return this.prisma.categories.delete({ where: { id } });
  }
}
