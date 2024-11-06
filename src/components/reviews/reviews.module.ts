import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsCommonModule } from '../common/reviewsCommon/reviewsCommon.module';

@Module({
  imports: [ReviewsCommonModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
