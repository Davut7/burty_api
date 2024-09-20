import { ApiProperty } from '@nestjs/swagger';
import { SpacesType } from 'src/helpers/types/spaces.type';

export class GetSpacesResponse extends SpacesType {
  @ApiProperty({ description: 'Distance between client and space' })
  distance: number;
}
