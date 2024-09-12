import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function DeleteAccountOperation() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({ type: SuccessMessageType }),
    ApiOperation({ summary: 'Delete current account' }),
    ApiNotFoundResponse({ description: 'User not found!' }),
  );
}
