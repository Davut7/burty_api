import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { UsersType } from 'src/helpers/types/users.type';

export class UserVerifyResponse extends PickType(SuccessResponse, [
  'message',
  'accessToken',
  'refreshToken',
] as const) {
  @ApiProperty({ type: UsersType })
  @Type(() => UsersType)
  user: UsersType;
}