import { ApiProperty } from '@nestjs/swagger';
import { LinkedSpaces } from '@prisma/client';

export class LinkedSpacesType implements LinkedSpaces {
  @ApiProperty({ description: 'Unique identifier for the linked space' })
  id: string;

  @ApiProperty({ description: 'Unique identifier for the user' })
  mentorId: string;

  @ApiProperty({ description: 'Unique index for the space' })
  spaceId: string;

  @ApiProperty({ description: 'Creation date of the linked space' })
  createdAt: Date;
}
