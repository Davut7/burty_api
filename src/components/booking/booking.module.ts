import { Module } from '@nestjs/common';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { MediaModule } from 'src/libs/media/media.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

@Module({
  imports: [MediaModule],
  controllers: [BookingController],
  providers: [BookingService, ImageTransformer],
})
export class BookingModule {}
