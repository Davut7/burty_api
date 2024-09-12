import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ClearCookieInterceptor } from 'src/common/interceptors/clearCookie.interceptor';
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
    UseInterceptors(ClearCookieInterceptor),
    ApiUnauthorizedResponse({ description: 'Refresh token not provided.' }),
  );
}
