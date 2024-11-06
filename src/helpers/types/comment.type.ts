import { ApiProperty } from '@nestjs/swagger';
import { Comments } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class CommentType implements Comments {
  @ApiProperty({ description: 'Unique identifier for the comment' })
  id: string;

  @ApiProperty({ description: 'Content of the comment' })
  comment: string;

  @Exclude()
  bookingId: string;

  @ApiProperty({
    description: 'The creation date of the comment',
    example: '2024-09-25T12:00:00Z',
  })
  createdAt: Date;

  @Exclude()
  userId: string;
}
