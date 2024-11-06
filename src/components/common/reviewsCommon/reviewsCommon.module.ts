import { Module } from '@nestjs/common';
import { ReviewsCommonService } from './reviewsCommon.service';

@Module({
  providers: [ReviewsCommonService],
  exports: [ReviewsCommonService],
})
export class ReviewsCommonModule {}
