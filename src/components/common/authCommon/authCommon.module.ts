import { Module } from '@nestjs/common';
import { AuthCommonService } from './authCommon.service';
import { TokenModule } from 'src/components/token/token.module';

@Module({
  imports:[TokenModule],
  providers: [AuthCommonService],
  exports: [AuthCommonService],
})
export class AuthCommonModule {}
