import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';

export class UserForgotPasswordVerificationResponse extends PickType(
  SuccessResponse,
  ['message'] as const,
) {
  @ApiProperty({ description: 'Link to reset password' })
  link!: string;
}
