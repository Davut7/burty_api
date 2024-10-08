import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteAccountOperation() {
  return applyDecorators(
    ApiOkResponse({ type: SuccessMessageType }),
    ApiOperation({ summary: 'Delete current account' }),
    ApiNotFoundResponse({ description: 'User not found!' }),
  );
}
