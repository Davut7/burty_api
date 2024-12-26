import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { CommentType } from 'src/helpers/types/comment.type';

export function GetBookingCommentsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve a booking comments' }),
    ApiResponse({
      status: 200,
      description: 'Booking comments retrieved successfully',
      type: [CommentType],
    }),
    ApiResponse({ status: 404, description: 'Booking not found' }),
    UseInterceptors(new TransformDataInterceptor(CommentType)),
  );
}
