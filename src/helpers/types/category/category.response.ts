import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { Type } from 'class-transformer';
import { SpacesType } from '../spaces.type';

export class CategoryResponseType implements Category {
  @ApiProperty({ description: 'Unique identifier for the category' })
  id: string;

  @ApiProperty({ description: 'Title of the category' })
  title: string;

  @ApiProperty({
    description: 'Spaces associated with this category',
    type: [SpacesType],
  })
  @Type(() => SpacesType)
  spaces?: SpacesType[];
}
