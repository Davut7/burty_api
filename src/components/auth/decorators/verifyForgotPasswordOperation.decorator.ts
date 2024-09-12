import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserVerificationDto } from '../dto/userVerification.dto';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function VerifyForgotPasswordOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify forgot password verification code' }),
    ApiParam({ name: 'userId', required: true }),
    ApiBody({ type: UserVerificationDto }),
    ApiOkResponse({
      description: 'Password verified successfully!',
      schema: { type: 'object', properties: { link: { type: 'string' } } },
    }),
    ApiBadRequestResponse({ description: 'User already verified' }),
    PUBLIC(),
  );
}
