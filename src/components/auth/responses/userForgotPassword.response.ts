import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';

export class UserForgotPasswordResponse extends PickType(SuccessResponse, [
  'message',
] as const) {
  @ApiProperty({ description: 'User id' })
  id!: string;
}
