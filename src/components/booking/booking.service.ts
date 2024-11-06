import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateBookingDto } from './dto/createBooking.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { BookingStatus, PassType } from '@prisma/client';
import { BookingTimeEnum, GetBookingsQuery } from './query/getBookings.query';
import { subDays } from 'date-fns';

@Injectable()
export class BookingService {
  constructor(private prismaService: PrismaService) {}

  async createBooking(
    dto: CreateBookingDto,
    spaceId: string,
    currentUser: UserTokenDto,
  ) {
    const [day, month, year] = dto.startDate.toString().split('.').map(Number);

    const [startHour, endHour] = dto.visitTime.split('-');

    const sessionDateTime = new Date(
      year,
      month - 1,
      day,
      +startHour.split(':')[0],
    );

    if (sessionDateTime.getTime() < Date.now()) {
      throw new BadRequestException('Нельзя бронировать в прошлом');
    }

    await this.checkBookingBusiness(sessionDateTime, dto.visitTime, spaceId);

    const space = await this.prismaService.spaces.findUnique({
      where: { id: spaceId },
    });

    let bookingPrice: number;
    let playersCount: number;

    if (dto.passType === PassType.full) {
      bookingPrice = space.maxPrice;
      playersCount = space.maxPlayers;
    } else if (dto.passType === PassType.duo) {
      bookingPrice = space.minPrice * 2;
      playersCount = 2;
    } else if (dto.passType === PassType.squad) {
      bookingPrice = space.minPrice * 4;
      playersCount = 4;
    } else if (dto.passType === PassType.team) {
      bookingPrice = space.minPrice * 5;
      playersCount = 5;
    } else if (dto.passType === PassType.single) {
      bookingPrice = space.minPrice;
      playersCount = 1;
    }

    return await this.prismaService.bookings.create({
      data: {
        spaceId,
        userId: currentUser.id,
        price: bookingPrice,
        playersCount,
        status: BookingStatus.pending,
        startDate: sessionDateTime,
        passType: dto.passType,
        startTime: startHour.toString(),
        endTime: endHour.toString(),
      },
    });
  }

  async cancelBooking(bookingId: string, currentUser: UserTokenDto) {
    const booking = await this.findBookingById(bookingId, currentUser.id);
    if (booking.status === BookingStatus.cancelled) {
      throw new BadRequestException('Booking already cancelled');
    }
    await this.prismaService.bookings.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    });

    return { message: 'Booking canceled' };
  }

  async getBookings(query: GetBookingsQuery, currentUser: UserTokenDto) {
    const { page = 1, take = 10, time = BookingTimeEnum.WEEK } = query;

    const startDate = subDays(new Date(), time);

    return await this.prismaService.bookings.findMany({
      where: {
        userId: currentUser.id,
        startDate: {
          gte: startDate,
          lte: new Date(),
        },
      },
      include: {
        spaces: {
          include: {
            medias: true,
          },
        },
      },
      take,
      skip: (page - 1) * take,
    });
  }

  async getOneBooking(bookingId: string, currentUser: UserTokenDto) {
    const booking = await this.prismaService.bookings.findUnique({
      where: { id: bookingId, userId: currentUser.id },
      include: { spaces: { include: { medias: true } } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found!');
    }

    return booking;
  }

  private async findBookingById(bookingId: string, userId: string) {
    const booking = await this.prismaService.bookings.findUnique({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found!');
    }

    return booking;
  }

  private async checkBookingBusiness(
    startDate: Date,
    visitTime: string,
    spaceId: string,
  ) {
    const [startTime, endTime] = visitTime.split('-');

    const booking = await this.prismaService.bookings.findFirst({
      where: {
        startDate: startDate,
        spaceId: spaceId,
        OR: [
          {
            startTime: {
              lte: endTime,
            },
            endTime: {
              gte: startTime,
            },
          },
        ],
      },
    });

    if (booking) {
      throw new ConflictException(
        'Booking already exists for this date and time!',
      );
    }
    return;
  }
}
