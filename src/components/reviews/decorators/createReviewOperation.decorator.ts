import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateReviewOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new review for a space' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Review created successfully.',
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description:
        'You cannot add a review if you have not booked this space yet.',
    }),
  );
}
