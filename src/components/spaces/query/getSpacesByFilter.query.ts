import { PickType, ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PassTypeEnum } from 'src/helpers/constants/passType.enum';
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
}
