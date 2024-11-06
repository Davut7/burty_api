import { Module } from '@nestjs/common';
import { BookingCommonService } from './bookingCommon.service';

@Module({
  providers: [BookingCommonService],
  exports: [BookingCommonService],
})
export class BookingCommonModule {}
