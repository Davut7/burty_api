import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { BookingType } from 'src/helpers/types/booking.type';

export function GetOneBookingOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve a single booking' }),
    ApiResponse({
      status: 200,
      description: 'Booking retrieved successfully',
      type: BookingType,
    }),
    ApiResponse({ status: 404, description: 'Booking not found' }),
    UseInterceptors(new TransformDataInterceptor(BookingType)),
  );
}
