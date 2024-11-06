import { Module } from '@nestjs/common';
import { CommentCommonService } from './commentCommon.service';

@Module({
  providers: [CommentCommonService],
  exports: [CommentCommonService],
})
export class CommentCommonModule {}
