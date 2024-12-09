import { Module } from '@nestjs/common';
import { UserCommonService } from './userCommon.service';

@Module({
  providers: [UserCommonService],
  exports: [UserCommonService],
})
export class UserCommonModule {}
