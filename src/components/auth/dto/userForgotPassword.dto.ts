import { PickType } from '@nestjs/swagger';
import { UserRegistrationDto } from './userRegistration.dto';

export class UserForgotPasswordDto extends PickType(UserRegistrationDto, [
  'email',
] as const) {}
