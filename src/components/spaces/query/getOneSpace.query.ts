import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class GetOneSpaceQuery {
  @ApiProperty({
    description: 'The longitude of the location.',
    example: '34.052235',
    type: String,
  })
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  longitude: number;

  @ApiProperty({
    description: 'The latitude of the location.',
    example: '-118.243683',
    type: String,
  })
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  latitude: number;
}
