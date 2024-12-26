import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetSpacesByFilterQuery extends PickType(PageOptionsDto, [
  'take',
  'page',
  'q',
] as const) {
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

  @ApiProperty({
    description:
      'The maximum distance in kilometers to search for nearby spaces.',
    type: Number,
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxDistance: number;

  @ApiProperty({
    description: 'The minimum players to filter spaces.',
    type: Number,
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  minPlayers: number;

  @ApiProperty({
    description: 'The maximum players to filter spaces.',
    type: Number,
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  maxPlayers: number;

  @ApiProperty({
    description: 'The minimum price to filter spaces.',
    type: Number,
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  minPrice: number;

  @ApiProperty({
    description: 'The maximum price to filter spaces.',
    type: Number,
    example: 500,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  maxPrice: number;
}
