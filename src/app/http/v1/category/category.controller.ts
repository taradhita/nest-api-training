import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  NotFoundException,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from '@/modules/category/category.service';
import { CategoryDto } from '@/modules/category/dto/category.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';
import { PaginateInterceptor } from '@/common/interceptors/paginate.interceptor';
import { Categories } from '@prisma/client';
import { PaginationResult } from 'prisma-paginate/dist/pagination/result/PaginationResult';
import { CategoryGetAllRequest } from '@/modules/category/interfaces/category-get-all-request.interface';
import { QueryPagination } from '@/common/decorators/query-pagination.decorator';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  create(@Body() categoryDto: CategoryDto): Promise<Categories> {
    return this.categoryService.create(categoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(PaginateInterceptor)
  findAll(
    @QueryPagination() { page, limit }: PaginationDto,
    @Query() request: CategoryGetAllRequest,
  ): Promise<PaginationResult> {
    return this.categoryService.findAll({ page, limit }, request.name);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Categories> {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryDto: CategoryDto,
  ): Promise<Categories> {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryService.update(id, categoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Categories> {
    return this.categoryService.remove(id);
  }
}
