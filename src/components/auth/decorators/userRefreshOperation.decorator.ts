import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserRefreshResponse } from '../responses/userRefresh.response';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function UserRefreshOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh tokens' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'User tokens refreshed successfully.',
      type: UserRefreshResponse,
    }),
    ApiUnauthorizedResponse({ description: 'Refresh token not provided!' }),
    ApiUnauthorizedResponse({ description: 'Invalid token!' }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    UseInterceptors(
      SetCookieInterceptor,
      new TransformDataInterceptor(UserRefreshResponse),
    ),
    PUBLIC(),
  );
}
