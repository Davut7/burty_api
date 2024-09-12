import { PickType } from '@nestjs/swagger';
import { UsersDto } from 'src/helpers/dto/users.dto';

export class UserRegistrationDto extends PickType(UsersDto, [
  'email',
  'role',
  'password',
]) {}
