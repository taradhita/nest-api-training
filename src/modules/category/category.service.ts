import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../providers/database/prisma/prisma.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PAGINATION_DEFAULTS } from '../../common/constants';
import { PaginationResult } from 'prisma-paginate';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.categories.create({
      data: createCategoryDto,
    });

    return category;
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginationResult> {
    const page = paginationDto.page || PAGINATION_DEFAULTS.PAGE;
    const limit = paginationDto.limit || PAGINATION_DEFAULTS.LIMIT;

    const categories = await this.prisma.categories.paginate({
      limit,
      page,
    });

    return categories;
  }

  async findOne(id: number) {
    const category = await this.prisma.categories.findFirst({ where: { id } });

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  remove(id: number) {
    return this.prisma.categories.delete({ where: { id } });
  }
}
