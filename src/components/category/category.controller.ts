import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { GetCategoriesQuery } from './query/getCategories.query';
import { ApiTags } from '@nestjs/swagger';
import { GetCategoriesOperation } from './decorators/getCategoriesOperation.decorator';
import { GetOneCategoryOperation } from './decorators/getOneCategoryOperation.decorator';
import { USER } from 'src/common/decorators/isUser.decorator';
import { CategoryType } from 'src/helpers/types/category/category.type';
import { CategoryResponseType } from 'src/helpers/types/category/category.response';

@ApiTags('Categories')
@USER()
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
