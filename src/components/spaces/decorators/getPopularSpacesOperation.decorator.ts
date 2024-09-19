import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetPopularSpacesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get popular spaces' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of popular spaces',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No popular spaces found.',
    }),
  );
}
