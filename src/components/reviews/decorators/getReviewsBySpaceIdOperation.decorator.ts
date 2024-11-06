import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ReviewsType } from 'src/helpers/types/reviews.type';

export function GetReviewsBySpaceIdOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Get reviews of one space' }),
    ApiOkResponse({ type: [ReviewsType] }),
  );
}
