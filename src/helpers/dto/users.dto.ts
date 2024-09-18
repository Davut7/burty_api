import { $Enums } from '@prisma/client';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { UsersType } from '../types/users.type';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UsersDto extends PickType(UsersType, [
  'email',
  'role',
  'userName',
  'provider',
]) {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password' })
  @IsStrongPassword()
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEnum($Enums.UserRole)
  @IsNotEmpty()
  role: $Enums.UserRole;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsEnum($Enums.AuthProviders)
  provider: $Enums.AuthProviders;
}
