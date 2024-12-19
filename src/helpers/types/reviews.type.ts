import { ApiProperty } from '@nestjs/swagger';
import { Reviews } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';
import { UsersType } from './users/users.type';

export class ReviewsType implements Reviews {
  @ApiProperty({ description: 'Reviews unique identifier' })
  id: string;

  @ApiProperty({ description: 'Review comment' })
  comment: string;

  @ApiProperty({ description: 'Review rate' })
  rating: number;

  @Exclude()
  spaceId: string;

  @Exclude()
  userId: string;

  @ApiProperty({ description: 'Review user' })
  @Type(() => UsersType)
  user: UsersType;
}
