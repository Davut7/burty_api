import { Category } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryType implements Category {
  @ApiProperty({ description: 'Unique identifier for the category' })
  id: string;

  @ApiProperty({ description: 'Title of the category' })
  title: string;
}
