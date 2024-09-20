import { applyDecorators, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { SpacesType } from 'src/helpers/types/spaces.type';

export function GetOneSpaceOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a single space by ID' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Details of a single space',
      type: SpacesType,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Space not found.',
    }),
    UseInterceptors(new TransformDataInterceptor(SpacesType)),
  );
}
