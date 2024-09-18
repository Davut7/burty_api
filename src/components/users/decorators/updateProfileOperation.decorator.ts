import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UpdateProfileOperation() {
  return applyDecorators(
    ApiOperation({ description: 'Profile update operation!' }),
    ApiOkResponse({ type: SuccessMessageType }),
    ApiNotFoundResponse({ description: 'User not found!' }),
  );
}
