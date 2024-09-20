import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Users } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { MediaType } from '../media.type';

export class UsersType implements Users {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: $Enums.UserRole,
    example: $Enums.UserRole.USER,
  })
  role: $Enums.UserRole;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  firstName: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Иван' })
  lastName: string;

  @Exclude()
  isDeleted: boolean;

  @ApiProperty({
    description: 'Последнее время входа пользователя в систему',
    example: '2024-09-12T12:34:56.789Z',
  })
  lastLoginTime: Date;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  isVerified: boolean;

  @Type(() => MediaType)
  @ApiProperty({ type: MediaType })
  media?: MediaType;

  @Exclude()
  provider: $Enums.AuthProviders;
}
