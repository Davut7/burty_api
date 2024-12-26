import { HttpCode, HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { BookingType } from 'src/helpers/types/booking.type';

export function GetBookingByQrCodeOperation() {
  return applyDecorators(
    ApiOkResponse({ type: BookingType }),
    ApiNotFoundResponse({ description: 'Booking not found!' }),
    HttpCode(HttpStatus.OK),
  );
}
