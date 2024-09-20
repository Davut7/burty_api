import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { CategoryType } from 'src/helpers/types/category/category.type';

export function GetCategoriesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve all categories' }),
    ApiResponse({
      status: 200,
      description: 'List of categories retrieved successfully.',
      type: [CategoryType],
    }),
    ApiResponse({ status: 404, description: 'No categories found.' }),
    UseInterceptors(new TransformDataInterceptor(CategoryType)),
  );
}
