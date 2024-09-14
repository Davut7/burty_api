import { Module } from '@nestjs/common';
import { FacebookAuthService } from './facebookAuth.service';
import { FacebookAuthController } from './facebookAuth.controller';
import { AuthCommonModule } from 'src/components/common/authCommon/authCommon.module';

@Module({
  imports: [AuthCommonModule],
  controllers: [FacebookAuthController],
  providers: [FacebookAuthService],
})
export class FacebookAuthModule {}
