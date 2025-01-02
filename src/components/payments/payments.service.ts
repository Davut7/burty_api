import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { BookingCommonService } from '../common/bookingCommon/bookingCommon.service';
import { UserTokenDto } from '../token/dto/token.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: PrismaService,
    private bookingCommonService: BookingCommonService,
  ) {}

  async payBooking(bookingId: string, currentUser: UserTokenDto) {
    const booking = await this.bookingCommonService.findBookingById(
      bookingId,
      currentUser.id,
    );

    if (booking.status === 'paid') {
      throw new ConflictException('Booking already paid');
    }

    if (booking.status === 'cancelled') {
      throw new ForbiddenException('Booking cancelled!');
    }

    await this.prismaService.bookings.update({
      where: { id: booking.id },
      data: { status: 'paid' },
    });

    return { message: 'Booking paid and QR code generated!' };
  }
}
