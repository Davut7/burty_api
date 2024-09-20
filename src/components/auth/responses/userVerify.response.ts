import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { UsersAuthType } from 'src/helpers/types/users/usersAuth.type';

export class UserVerifyResponse extends PickType(SuccessResponse, [
  'message',
  'accessToken',
  'refreshToken',
] as const) {
  @ApiProperty({ type: UsersAuthType })
  @Type(() => UsersAuthType)
  user: UsersAuthType;
}
