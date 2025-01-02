import { Module } from '@nestjs/common';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { MediaModule } from 'src/libs/media/media.module';
import { UserCommonModule } from '../common/userCommon/userCommon.module';
import { MailsModule } from '../mails/mails.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [MediaModule, UserCommonModule, MailsModule],
  controllers: [BookingController],
  providers: [BookingService, ImageTransformer],
})
export class BookingModule {}
