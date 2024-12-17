import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';
import { CategoryResponseType } from 'src/helpers/types/category/category.response';
import { CategoryType } from 'src/helpers/types/category/category.type';
import { CategoryService } from './category.service';
import { GetCategoriesOperation } from './decorators/getCategoriesOperation.decorator';
import { GetOneCategoryOperation } from './decorators/getOneCategoryOperation.decorator';
import { GetCategoriesQuery } from './query/getCategories.query';

@ApiTags('Categories')
@PUBLIC()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('')
  @GetCategoriesOperation()
  async getCategories(
    @Query() query: GetCategoriesQuery,
  ): Promise<CategoryType[]> {
    return await this.categoryService.getCategories(query);
  }

  @Get(':categoryId')
  @GetOneCategoryOperation()
  async getOneCategory(
    @Param('categoryId', ParseUUIDPipe) categoryId: string,
  ): Promise<CategoryResponseType> {
    return await this.categoryService.getOneCategory(categoryId);
  }
}
