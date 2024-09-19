import { Category } from '@prisma/client';
import { SpacesType } from './spaces.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryType implements Category {
  @ApiProperty({ description: 'Unique identifier for the category' })
  id: string;

  @ApiProperty({ description: 'Title of the category' })
  title: string;

  @ApiProperty({
    description: 'Spaces associated with this category',
    type: SpacesType,
  })
  @Type(() => SpacesType)
  spaces: SpacesType;
}
