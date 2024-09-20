import { applyDecorators, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { SpacesType } from 'src/helpers/types/spaces.type';

export function GetSpacesByFilterOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get spaces by filters' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of spaces matching the filters',
      type: SpacesType,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No spaces found with the provided filters.',
    }),
    UseInterceptors(new TransformDataInterceptor(SpacesType)),
  );
}
