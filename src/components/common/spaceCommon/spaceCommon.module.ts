import { Module } from '@nestjs/common';
import { SpaceCommonService } from './spaceCommon.service';

@Module({
  providers: [SpaceCommonService],
  exports: [SpaceCommonService],
})
export class SpaceCommonModule {}
