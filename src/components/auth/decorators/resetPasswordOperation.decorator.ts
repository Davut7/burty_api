import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from '../dto/resetPassword.dto';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { RESET_TOKEN } from 'src/common/decorators/isResetToken.decorator';

export function ResetPasswordOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset password' }),
    ApiBearerAuth(),
    ApiBody({ type: ResetPasswordDto }),
    ApiResponse({
      status: 200,
      description: 'User password updated successfully!',
      type: SuccessMessageType,
    }),
    ApiNotFoundResponse({ description: 'User not found!' }),
    RESET_TOKEN(),
  );
}
