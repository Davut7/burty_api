import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { SuccessResponse } from 'src/helpers/common/successResponse.type';
import { UsersType } from 'src/helpers/types/users/users.type';

export class UpdateUserProfile extends PickType(SuccessResponse, ['message']) {
  @Type(() => UsersType)
  @ApiProperty({ type: UsersType })
  user: UsersType;
}
