import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { CommentType } from 'src/helpers/types/comment.type';

export function CreateCommentOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new comment' }),
    ApiResponse({
      status: 201,
      description: 'Comment created successfully',
      type: CommentType,
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    UseInterceptors(new TransformDataInterceptor(CommentType)),
  );
}
