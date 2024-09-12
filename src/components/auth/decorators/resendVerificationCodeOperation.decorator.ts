import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { seconds, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { SetCookieInterceptor } from 'src/common/interceptors/setCookie.interceptor';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserResendVerificationCodeResponse } from '../responses/userResendVerificationCode.response';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function ResendVerificationCodeOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Resend verification code' }),
    ApiParam({ name: 'userId', required: true }),
    ApiResponse({
      status: 200,
      description: 'Verification code sent successfully.',
      type: UserResendVerificationCodeResponse,
    }),
    ApiBadRequestResponse({ description: 'User already verified' }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    Throttle({ default: { limit: 1, ttl: seconds(60 * 2) } }),
    UseGuards(ThrottlerGuard),
    UseInterceptors(
      SetCookieInterceptor,
      new TransformDataInterceptor(UserResendVerificationCodeResponse),
    ),
    PUBLIC(),
  );
}
