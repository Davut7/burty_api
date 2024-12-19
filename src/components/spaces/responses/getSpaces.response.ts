import { ApiProperty } from '@nestjs/swagger';
import { SpacesType } from 'src/helpers/types/spaces.type';

export class GetSpacesResponse extends SpacesType {
  @ApiProperty({
    description: 'Distance between client and space in kilometers',
  })
  distanceInKm: number;

  @ApiProperty({
    description: 'Distance between client and space in metres',
  })
  distanceInM: number;

  @ApiProperty({ description: 'Avarage rating of space' })
  averageRating: number;
}
