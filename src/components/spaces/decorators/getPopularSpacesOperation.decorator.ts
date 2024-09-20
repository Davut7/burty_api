import { applyDecorators, HttpStatus, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { SpacesType } from 'src/helpers/types/spaces.type';

export function GetPopularSpacesOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get popular spaces' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'List of popular spaces',
      type:[SpacesType]
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'No popular spaces found.',
    }),
    UseInterceptors(new TransformDataInterceptor(SpacesType)),
  );
}
