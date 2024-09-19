import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function GetNearbySpacesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get nearby spaces' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of nearby spaces',
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No nearby spaces found.',
    }),
  );
}
