import { Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { UsersAuthType } from 'src/helpers/types/users/usersAuth.type';

export class UserLoginResponse extends PickType(SuccessResponse, [
  'message',
  'accessToken',
  'refreshToken' as const,
]) {
  @ApiProperty({ type: UsersAuthType })
  @Type(() => UsersAuthType)
  user!: UsersAuthType;
}
