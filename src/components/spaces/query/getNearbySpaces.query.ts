import { PickType, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional
} from 'class-validator';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetNearbySpacesQuery extends PickType(PageOptionsDto, [
  'page',
  'take',
] as const) {
  @ApiProperty({
    description: 'The longitude of the location.',
    example: '34.052235',
    type: String,
  })
  @IsNotEmpty()
  @IsLongitude()
  @Transform(({ value }) => parseFloat(value))
  longitude: number;

  @ApiProperty({
    description: 'The latitude of the location.',
    example: '-118.243683',
    type: String,
  })
  @IsNotEmpty()
  @IsLatitude()
  @Transform(({ value }) => parseFloat(value))
  latitude: number;

  @ApiProperty({
    description:
      'The maximum distance in kilometers to search for nearby spaces.',
    example: 10,
    type: Number,
    required: false,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxDistance: number;
}
