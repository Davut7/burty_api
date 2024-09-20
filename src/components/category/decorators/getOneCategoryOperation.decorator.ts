import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { CategoryResponseType } from 'src/helpers/types/category/category.response';

export function GetOneCategoryOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve a single category by ID' }),
    ApiResponse({
      status: 200,
      description: 'Category retrieved successfully.',
      type: CategoryResponseType,
    }),
    ApiResponse({ status: 404, description: 'Category not found.' }),
    UseInterceptors(new TransformDataInterceptor(CategoryResponseType)),
  );
}
