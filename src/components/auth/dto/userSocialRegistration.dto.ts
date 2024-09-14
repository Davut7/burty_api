import { UsersDto } from 'src/helpers/dto/users.dto';
import { PickType } from '@nestjs/swagger';

export class UserSocialRegistrationDto extends PickType(UsersDto, [
  'email',
  'userName',
]) {}
