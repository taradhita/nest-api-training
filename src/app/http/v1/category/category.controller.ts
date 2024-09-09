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
import { CategoryService } from '../../../../modules/category/category.service';
import { CreateCategoryDto } from '../../../../modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '../../../../modules/category/dto/update-category.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { TransformInterceptor } from '../../../../common/interceptors/transform.interceptor';
import { PaginateInterceptor } from '../../../../common/interceptors/paginate.interceptor';
import { Categories } from '@prisma/client';
import { PaginationResult } from 'prisma-paginate/dist/pagination/result/PaginationResult';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Categories> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(PaginateInterceptor)
  findAll(@Query() paginationDto?: PaginationDto): Promise<PaginationResult> {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Categories> {
    const category = await this.categoryService.findOne(+id);
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Categories> {
    const category = await this.categoryService.findOne(+id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Categories> {
    return this.categoryService.remove(+id);
  }
}
