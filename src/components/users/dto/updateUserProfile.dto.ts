import { PartialType, PickType } from '@nestjs/swagger';
import { UsersDto } from 'src/helpers/dto/users.dto';

export class UpdateUserProfileDto extends PartialType(
  PickType(UsersDto, ['email', 'password', 'firstName', 'lastName']),
) {}
