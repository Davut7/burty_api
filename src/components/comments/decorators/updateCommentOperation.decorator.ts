import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { CommentType } from 'src/helpers/types/comment.type';

export function UpdateCommentOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Update an existing comment' }),
    ApiResponse({
      status: 200,
      description: 'Comment updated successfully',
      type: CommentType,
    }),
    ApiResponse({ status: 404, description: 'Comment not found' }),
    UseInterceptors(new TransformDataInterceptor(CommentType)),
  );
}
