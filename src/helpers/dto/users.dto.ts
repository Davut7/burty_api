import { $Enums } from '@prisma/client';
import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UsersType } from '../types/users/users.type';

export class UsersDto extends PickType(UsersType, [
  'email',
  'role',
  'firstName',
  'lastName',
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
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEnum($Enums.AuthProviders)
  provider: $Enums.AuthProviders;
}
