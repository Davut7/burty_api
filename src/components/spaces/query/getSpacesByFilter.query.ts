import { PickType, ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ArrayNotEmpty,
  Matches,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PassTypeEnum } from 'src/helpers/constants/passType.enum';
import { PageOptionsDto } from 'src/helpers/dto/page.dto';

export class GetSpacesByFilterQuery extends PickType(PageOptionsDto, [
  'take',
  'page',
  'q',
] as const) {
  @ApiProperty({
    description: 'List of category IDs to filter spaces by.',
    type: [String],
    example: ['123', '456'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoryIds: string[];

  @ApiProperty({
    description: 'The longitude of the location.',
    example: '34.052235',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsLongitude()
  longitude: string;

  @ApiProperty({
    description: 'The latitude of the location.',
    example: '-118.243683',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @IsLatitude()
  latitude: string;

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
    description: 'The type of pass required for the space.',
    enum: PassTypeEnum,
    example: PassTypeEnum.single,
    required: false,
  })
  @IsOptional()
  @IsEnum(PassTypeEnum)
  passType: PassTypeEnum;

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

  @ApiProperty({
    description: 'Visit time range in HH:MM-HH:MM format.',
    type: String,
    example: '14:00-15:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)-([0-1]\d|2[0-3]):([0-5]\d)$/, {
    message: 'visitTime must be in HH:MM-HH:MM format',
  })
  visitTime: string;
}
