import { ApiProperty } from '@nestjs/swagger';
import { Reviews } from '@prisma/client';
import { Exclude } from 'class-transformer';

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
}
