import { applyDecorators, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { SpacesType } from 'src/helpers/types/spaces.type';

export function GetNearbySpacesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get nearby spaces' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of nearby spaces',
      type: [SpacesType],
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No nearby spaces found.',
    }),
    UseInterceptors(new TransformDataInterceptor(SpacesType)),
  );
}
