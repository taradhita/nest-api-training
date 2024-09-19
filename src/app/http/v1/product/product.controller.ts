import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from '@/modules/product/product.service';
import { ProductDto } from '@/modules/product/dto/product.dto';
import { QueryPagination } from '@/common/decorators/query-pagination.decorator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { PaginateInterceptor } from '@/common/interceptors/paginate.interceptor';
import { Products } from '@prisma/client';
import { PaginationResult } from 'prisma-paginate';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async create(@Body() productDto: ProductDto): Promise<Products> {
    return this.productService.create(productDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(PaginateInterceptor)
  async findAll(
    @QueryPagination() paginationDto: PaginationDto,
  ): Promise<PaginationResult> {
    return this.productService.findAll(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Products> {
    const product = await this.productService.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() productDto: ProductDto,
  ) {
    const product = await this.productService.update(id, productDto);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedProduct = this.productService.remove(id);

    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }

    return deletedProduct;
  }
}
