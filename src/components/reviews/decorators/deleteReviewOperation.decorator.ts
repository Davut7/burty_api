import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteReviewOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a review' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Review deleted successfully.',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Review not found.',
    }),
  );
}
