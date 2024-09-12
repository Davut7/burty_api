import { PickType } from '@nestjs/swagger';
import { UsersDto } from 'src/helpers/dto/users.dto';

export class ResetPasswordDto extends PickType(UsersDto, [
  'password',
] as const) {}
