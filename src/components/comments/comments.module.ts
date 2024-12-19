import { Module } from '@nestjs/common';
import { BookingCommonModule } from '../common/bookingCommon/bookingCommon.module';
import { CommentCommonModule } from '../common/commentCommon/commentCommon.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [CommentCommonModule, BookingCommonModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
