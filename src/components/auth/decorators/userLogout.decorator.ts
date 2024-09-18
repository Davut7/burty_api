import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

export function UserLogoutOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'User logout' }),
    ApiBearerAuth(),
    ApiResponse({
      status: 200,
      description: 'Log out successfully.',
      type: SuccessMessageType,
    }),
    ApiUnauthorizedResponse({ description: 'Refresh token not provided.' }),
  );
}
