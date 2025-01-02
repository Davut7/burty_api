import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { USER } from 'src/common/decorators/isUser.decorator';
import { CategoryResponseType } from 'src/helpers/types/category/category.response';
import { CategoryType } from 'src/helpers/types/category/category.type';
import { UserTokenDto } from '../token/dto/token.dto';
import { CategoryService } from './category.service';
import { GetCategoriesOperation } from './decorators/getCategoriesOperation.decorator';
import { GetOneCategoryOperation } from './decorators/getOneCategoryOperation.decorator';
import { GetCategoriesQuery } from './query/getCategories.query';

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
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<CategoryResponseType> {
    return await this.categoryService.getOneCategory(
      categoryId,
      currentUser.id,
    );
  }
}
