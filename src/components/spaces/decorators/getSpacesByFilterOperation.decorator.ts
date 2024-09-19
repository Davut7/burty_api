import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetSpacesByFilterOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get spaces by filters' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of spaces matching the filters',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No spaces found with the provided filters.',
    }),
  );
}
