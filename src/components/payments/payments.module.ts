import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { BookingCommonModule } from '../common/bookingCommon/bookingCommon.module';
import { MediaModule } from 'src/libs/media/media.module';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';

@Module({
  imports: [BookingCommonModule, MediaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, ImageTransformer],
})
export class PaymentsModule {}
