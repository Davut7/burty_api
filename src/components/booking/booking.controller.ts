import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { USER } from 'src/common/decorators/isUser.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { BookingService } from './booking.service';
import { CancelBookingOperation } from './decorator/cancelBookingOperation.decorator';
import { CreateBookingOperation } from './decorator/createBookingOperation.decorator';
import { GetBookingCommentsOperation } from './decorator/getBookingCommentsOperation.decorator';
import { GetBookingsOperation } from './decorator/getBookingsOperation.decorator';
import { GetOneBookingOperation } from './decorator/getOneBookingOperation.decorator';
import { AddParticipiantsToBookingDto } from './dto/addParticipiantsToBooking.dto';
import { CreateBookingDto } from './dto/createBooking.dto';
import { GetBookingsQuery } from './query/getBookings.query';

@USER()
@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(':spaceId')
  @CreateBookingOperation()
  async createBooking(
    @Body() dto: CreateBookingDto,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
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

  @Post(':bookingId/participiants')
  async addParticipiants(
    @CurrentUser() currentUser: UserTokenDto,
    @Body() dto: AddParticipiantsToBookingDto,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return await this.bookingService.addParticipiants(
      bookingId,
      dto,
      currentUser,
    );
  }

  @Get('/participiants')
  async verifiyBookingParticipiant(
    @CurrentUser() currentUser: UserTokenDto,
    @Query('bookingId', ParseUUIDPipe) bookingId: string,
    @Query('userId', ParseUUIDPipe) userId: string,
  ) {
    return await this.bookingService.verifiyBookingParticipiant(
      bookingId,
      userId,
      currentUser,
    );
  }

  @Get(':bookingId')
  @GetOneBookingOperation()
  async getOneBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.bookingService.getOneBooking(bookingId, currentUser);
  }

  @Get(':bookingId/comments')
  @GetBookingCommentsOperation()
  async getBookingComments(
    @Param('bookingId') bookingId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.bookingService.getBookingComments(bookingId, currentUser);
  }
}
