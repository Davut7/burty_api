import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { GetBookingsQuery } from './query/getBookings.query';
import { UserTokenDto } from '../token/dto/token.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookingOperation } from './decorator/createBookingOperation.decorator';
import { CancelBookingOperation } from './decorator/cancelBookingOperation.decorator';
import { GetBookingsOperation } from './decorator/getBookingsOperation.decorator';
import { GetOneBookingOperation } from './decorator/getOneBookingOperation.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(':spaceId')
  @CreateBookingOperation()
  async createBooking(
    @Body() dto: CreateBookingDto,
    @Param('spaceId') spaceId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.bookingService.createBooking(dto, spaceId, currentUser);
  }

  @Patch(':bookingId/cancel')
  @CancelBookingOperation()
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.bookingService.cancelBooking(bookingId, currentUser);
  }

  @Get()
  @GetBookingsOperation()
  async getBookings(
    @Query() query: GetBookingsQuery,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.bookingService.getBookings(query, currentUser);
  }

  @Get(':bookingId')
  @GetOneBookingOperation()
  async getOneBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.bookingService.getOneBooking(bookingId, currentUser);
  }
}
