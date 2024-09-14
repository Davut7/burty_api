import { Module } from '@nestjs/common';
import { GoogleAuthService } from './googleAuth.service';
import { GoogleAuthController } from './googleAuth.controller';
import { AuthCommonModule } from 'src/components/common/authCommon/authCommon.module';

@Module({
  imports: [AuthCommonModule],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService],
})
export class GoogleAuthModule {}
