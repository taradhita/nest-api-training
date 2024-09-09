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

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(PaginateInterceptor)
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
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
  ) {
    const category = await this.categoryService.findOne(+id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(+id);
  }
}
