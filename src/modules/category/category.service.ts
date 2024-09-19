import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from 'prisma-paginate';
import { Categories } from '@prisma/client';
import { getPagination } from '@/common/utils/shared.utils';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(categoryDto: CategoryDto): Promise<Categories> {
    const category = await this.prisma.categories.create({
      data: categoryDto,
    });

    return category;
  }

  async findAll(
    paginationDto?: PaginationDto,
    name?: string,
  ): Promise<PaginationResult> {
    const { page, limit } = getPagination(paginationDto);

    const categories = await this.prisma.categories.paginate(
      {
        where: { name: { contains: name } },
      },
      {
        page,
        limit,
      },
    );

    return categories;
  }

  async findOne(id: number): Promise<Categories> {
    return this.prisma.categories.findFirst({ where: { id } });
  }

  async update(id: number, categoryDto: CategoryDto): Promise<Categories> {
    const category = await this.prisma.categories.update({
      where: { id },
      data: categoryDto,
    });

    return category;
  }

  async remove(id: number): Promise<Categories> {
    return this.prisma.categories.delete({ where: { id } });
  }
}
