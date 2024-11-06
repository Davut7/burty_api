import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { BookingType } from 'src/helpers/types/booking.type';

export function GetBookingsOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Retrieve user bookings' }),
    ApiResponse({
      status: 200,
      description: 'List of bookings retrieved successfully',
      type: [BookingType],
    }),
    ApiResponse({ status: 404, description: 'No bookings found' }),
    UseInterceptors(new TransformDataInterceptor(BookingType)),
  );
}
