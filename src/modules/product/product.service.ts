import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { Products } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { getPagination } from '@/common/utils/shared.utils';
import { PaginationResult } from 'prisma-paginate';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto): Promise<Products> {
    const product = await this.prisma.products.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        description: createProductDto.description,
        categories: {
          connect: createProductDto.categories.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
      },
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResult> {
    const { page, limit } = getPagination(paginationDto);

    return this.prisma.products.paginate(
      {
        include: {
          categories: true,
        },
      },
      {
        page,
        limit,
      },
    );
  }

  async findOne(id: number): Promise<Products> {
    return this.prisma.products.findFirst({
      where: { id },
      include: {
        categories: true,
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    const product = await this.prisma.products.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        description: updateProductDto.description,
        categories: {
          connect: updateProductDto.categories.map((id) => ({ id })),
        },
      },
      include: {
        categories: true,
      },
    });

    return product;
  }

  async remove(id: number): Promise<Products> {
    return this.prisma.products.delete({ where: { id } });
  }
}
