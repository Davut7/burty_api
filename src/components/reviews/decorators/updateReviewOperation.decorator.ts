import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function UpdateReviewOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing review' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Review updated successfully.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Review not found.',
    }),
  );
}
