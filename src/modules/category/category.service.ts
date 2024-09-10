import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { PaginationResult } from 'prisma-paginate';
import { Categories } from '@prisma/client';
import { getPagination } from '@/common/utils/shared.utils';
// import { getPagination } from '@/common/utils/shared.utils';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Categories> {
    const category = await this.prisma.categories.create({
      data: createCategoryDto,
    });

    return category;
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginationResult> {
    const { page, limit } = getPagination(paginationDto);

    const categories = await this.prisma.categories.paginate({
      page,
      limit,
    });

    return categories;
  }

  async findOne(id: number): Promise<Categories> {
    return this.prisma.categories.findFirst({ where: { id } });
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Categories> {
    const category = await this.prisma.categories.update({
      where: { id },
      data: updateCategoryDto,
    });

    return category;
  }

  async remove(id: number): Promise<Categories> {
    return this.prisma.categories.delete({ where: { id } });
  }
}
