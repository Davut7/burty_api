import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetOneSpaceOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single space by ID' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Details of a single space',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Space not found.',
    }),
  );
}
