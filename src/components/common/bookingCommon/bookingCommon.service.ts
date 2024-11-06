import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class BookingCommonService {
  constructor(private prismaService: PrismaService) {}

  async findBookingById(bookingId: string, userId: string) {
    const booking = await this.prismaService.bookings.findUnique({
      where: { id: bookingId, userId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found!');
    }
    return booking;
  }
}
