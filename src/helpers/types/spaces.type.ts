import { Spaces } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SpacesType implements Spaces {
  @ApiProperty({ description: 'Unique identifier for the space' })
  id: string;

  @ApiProperty({ description: 'Name of the space' })
  name: string;

  @Exclude()
  categoryId: string;

  @ApiProperty({ description: 'Address of the space' })
  address: string;

  @ApiProperty({
    description: 'End time for the space availability',
    type: Date,
  })
  endTime: Date;

  @ApiProperty({ description: 'Latitude of the space location' })
  latitude: string;

  @ApiProperty({ description: 'Longitude of the space location' })
  longitude: string;

  @ApiProperty({
    description: 'Maximum number of players allowed in the space',
  })
  maxPlayers: number;

  @ApiProperty({ description: 'Maximum price for using the space' })
  maxPrice: number;

  @ApiProperty({
    description: 'Minimum number of players required in the space',
  })
  minPlayers: number;

  @ApiProperty({ description: 'Minimum price for using the space' })
  minPrice: number;

  @ApiProperty({ description: 'Opening time for the space', type: Date })
  openTime: Date;

  @ApiProperty({ description: 'Contact phone number for the space' })
  phoneNumber: string;

  @ApiProperty({ description: 'Website URL for the space' })
  site: string;
}
