import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UsersType } from 'src/helpers/types/users/users.type';

export function GetMeOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get me operation' }),
    ApiOkResponse({ type: UsersType }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    UseInterceptors(new TransformDataInterceptor(UsersType)),
  );
}
