import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransformDataInterceptor } from 'src/common/interceptors/transformData.interceptor';
import { BookingType } from 'src/helpers/types/booking.type';

export function CreateBookingOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new booking' }),
    ApiResponse({
      status: 201,
      description: 'Booking created successfully',
      type: BookingType,
    }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    UseInterceptors(new TransformDataInterceptor(BookingType)),
  );
}
