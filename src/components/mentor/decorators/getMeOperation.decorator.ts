import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { UsersType } from 'src/helpers/types/users/users.type';

export function GetMeOperation() {
  return applyDecorators(
    ApiOkResponse({ type: UsersType }),
    ApiNotFoundResponse({ description: 'User not found!' }),
  );
}
