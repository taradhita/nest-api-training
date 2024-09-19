import { Injectable } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { PrismaService } from '@/providers/database/prisma/prisma.service';
import { Products } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { getPagination } from '@/common/utils/shared.utils';
import { PaginationResult } from 'prisma-paginate';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(productDto: ProductDto): Promise<Products> {
    const product = await this.prisma.products.create({
      data: {
        name: productDto.name,
        price: productDto.price,
        description: productDto.description,
        categories: {
          connect: productDto.categories.map((id) => ({ id })),
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

  async update(id: number, productDto: ProductDto): Promise<Products> {
    const product = await this.prisma.products.update({
      where: { id },
      data: {
        name: productDto.name,
        price: productDto.price,
        description: productDto.description,
        categories: {
          connect: productDto.categories.map((id) => ({ id })),
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
