import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { GetCategoriesQuery } from './query/getCategories.query';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  async getCategories(@Query() query: GetCategoriesQuery) {
    return await this.categoryService.getCategories(query);
  }

  @Get(':categoryId')
  async getOneCategory(@Param('categoryId', ParseUUIDPipe) categoryId: string) {
    return await this.categoryService.getOneCategory(categoryId);
  }
}
