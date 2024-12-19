import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UsersType } from 'src/helpers/types/users/users.type';

export function GetMeOperation() {
  return applyDecorators(
    ApiOkResponse({ type: UsersType }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    UseInterceptors(new TransformDataInterceptor(UsersType)),
  );
}
