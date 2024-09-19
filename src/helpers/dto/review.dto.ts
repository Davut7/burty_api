import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ReviewsType } from '../types/reviews.type';
import { PickType } from '@nestjs/swagger';

export class ReviewDto extends PickType(ReviewsType, [
  'rating',
  'comment',
] as const) {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  @IsPositive()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
