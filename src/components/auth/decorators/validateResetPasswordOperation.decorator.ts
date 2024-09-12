import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ValidateResetPasswordResponse } from '../responses/validateResetPasswordLink.response';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function ValidateResetPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Validate reset password link' }),
    ApiQuery({ name: 'resetToken', required: true }),
    ApiQuery({ name: 'userId', required: true }),
    ApiOkResponse({
      description: 'Reset password link is verified.',
      type: ValidateResetPasswordResponse,
    }),
    ApiUnauthorizedResponse({ description: 'Reset token is expired.' }),
    PUBLIC(),
  );
}
