import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseInterceptors,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from '@/modules/product/product.service';
import { CreateProductDto } from '@/modules/product/dto/create-product.dto';
import { UpdateProductDto } from '@/modules/product/dto/update-product.dto';
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
  async create(@Body() createProductDto: CreateProductDto): Promise<Products> {
    return this.productService.create(createProductDto);
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
    const product = await this.productService.findOne(+id);

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
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(+id, updateProductDto);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedProduct = this.productService.remove(+id);

    if (!deletedProduct) {
      throw new NotFoundException('Product not found');
    }

    return deletedProduct;
  }
}
