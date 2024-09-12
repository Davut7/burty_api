import { PickType } from '@nestjs/swagger';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';

export class ValidateResetPasswordResponse extends PickType(SuccessResponse, [
  'message',
  'resetToken',
] as const) {}
