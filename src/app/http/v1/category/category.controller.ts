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
} from '@nestjs/common';
import { CategoryService } from '../../../../modules/category/category.service';
import { CreateCategoryDto } from '../../../../modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from '../../../../modules/category/dto/update-category.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);
    if (!category.data) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.findOne(+id);
    if (!category.data) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
