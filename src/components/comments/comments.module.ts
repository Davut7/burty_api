import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CommentCommonModule } from '../common/commentCommon/commentCommon.module';

@Module({
  imports:[CommentCommonModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
