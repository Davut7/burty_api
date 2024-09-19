import { Module } from '@nestjs/common';
import { CategoryCommonService } from './categoryCommon.service';

@Module({
  providers: [CategoryCommonService],
  exports: [CategoryCommonService],
})
export class CategoryCommonModule {}
