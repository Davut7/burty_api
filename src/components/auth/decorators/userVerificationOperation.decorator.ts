import { applyDecorators, UseInterceptors } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UserVerificationDto } from '../dto/userVerification.dto';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { UserVerifyResponse } from '../responses/userVerify.response';
import { PUBLIC } from 'src/common/decorators/isPublic.decorator';

export function UserVerificationOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify user' }),
    ApiParam({ name: 'userId', required: true }),
    ApiBody({ type: UserVerificationDto }),
    ApiOkResponse({
      description: 'User verified  successfully.',
      type: UserVerifyResponse,
    }),
    ApiBadRequestResponse({ description: 'Verification code mismatch' }),
    ApiBadRequestResponse({ description: 'Verification code expired!' }),
    ApiConflictResponse({ description: 'User already verified' }),
    UseInterceptors(new TransformDataInterceptor(UserVerifyResponse)),
    PUBLIC(),
  );
}
