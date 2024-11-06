import { Controller, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':bookingId/pay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Pay for a booking' })
  @ApiParam({
    name: 'bookingId',
    description: 'ID of the booking to be paid for',
    example: 'ccb198ed-2aa0-4ceb-ac66-ee13c80f73d7',
  })
  @ApiResponse({ status: 200, description: 'Booking paid!' })
  @ApiResponse({ status: 403, description: 'Booking cancelled!' })
  @ApiResponse({ status: 409, description: 'Booking already paid' })
  async payBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return await this.paymentsService.payBooking(bookingId, currentUser);
  }
}
