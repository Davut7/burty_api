import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CancelBookingOperation() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel a booking' }),
    ApiResponse({
      status: 200,
      description: 'Booking cancelled successfully',
    }),
    ApiResponse({ status: 404, description: 'Booking not found' }),
  );
}
