import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteCommentOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a comment' }),
    ApiResponse({ status: 200, description: 'Comment deleted successfully' }),
    ApiResponse({ status: 404, description: 'Comment not found' }),
  );
}
