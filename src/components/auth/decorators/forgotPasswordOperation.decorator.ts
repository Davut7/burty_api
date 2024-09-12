import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserForgotPasswordDto } from '../dto/userForgotPassword.dto';
import { seconds, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UserForgotPasswordResponse } from '../responses/userForgotPassword.response';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function ForgotPasswordOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Initiate forgot password process' }),
    ApiBody({ type: UserForgotPasswordDto }),
    ApiResponse({
      status: 200,
      description: 'Verification code sent successfully!',
      type: UserForgotPasswordResponse,
    }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    Throttle({ default: { limit: 1, ttl: seconds(60 * 2) } }),
    UseGuards(ThrottlerGuard),
    PUBLIC(),
  );
}
