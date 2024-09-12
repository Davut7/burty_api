import { PickType } from '@nestjs/swagger';
import { UsersDto } from 'src/helpers/dto/users.dto';

export class UserLoginDto extends PickType(UsersDto, ['password', 'email']) {}
