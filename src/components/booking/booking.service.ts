import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BookingStatus } from '@prisma/client';
import { addDays } from 'date-fns';
import { CommentType } from 'src/helpers/types/comment.type';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserCommonService } from '../common/userCommon/userCommon.service';
import { MailsService } from '../mails/mails.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { AddParticipiantsToBookingDto } from './dto/addParticipiantsToBooking.dto';
import { CreateBookingDto } from './dto/createBooking.dto';
import { BookingTimeEnum, GetBookingsQuery } from './query/getBookings.query';
@Injectable()
export class BookingService {
  private backendUrl: string;
  constructor(
    private prismaService: PrismaService,
    private userCommonService: UserCommonService,
    private mailService: MailsService,
    private configService: ConfigService,
  ) {
    this.backendUrl = this.configService.getOrThrow<string>('BACKEND_URL');
  }

  async createBooking(
    dto: CreateBookingDto,
    spaceId: string,
    currentUser: UserTokenDto,
  ) {
    const space = await this.getSpaceById(spaceId);
    this.validateBookingRequest(dto, space);

    const sessionDateTime = this.getSessionDateTime(
      dto.startDate,
      dto.visitTime,
    );
    this.validateSessionDateTime(sessionDateTime);

    await this.checkBookingBusiness(sessionDateTime, dto.visitTime, spaceId);

    const bookingPrice = this.calculateBookingPrice(space, dto.playersCount);

    return await this.createBookingRecord({
      dto,
      spaceId,
      currentUser,
      sessionDateTime,
      bookingPrice,
    });
  }

  private async createBookingRecord({
    dto,
    spaceId,
    currentUser,
    sessionDateTime,
    bookingPrice,
  }: {
    dto: CreateBookingDto;
    spaceId: string;
    currentUser: UserTokenDto;
    sessionDateTime: Date;
    bookingPrice: number;
  }) {
    const [startHour, endHour] = dto.visitTime.split('-');
    return await this.prismaService.bookings.create({
      data: {
        spaceId,
        userId: currentUser.id,
        price: bookingPrice,
        playersCount: dto.playersCount,
        status: BookingStatus.pending,
        startDate: sessionDateTime,
        startTime: startHour.toString(),
        endTime: endHour.toString(),
      },
    });
  }

  private async getSpaceById(spaceId: string) {
    const space = await this.prismaService.spaces.findUnique({
      where: { id: spaceId },
    });
    if (!space) {
      throw new NotFoundException('Space not found!');
    }
    return space;
  }

  private validateBookingRequest(dto: CreateBookingDto, space: any) {
    if (space.maxPlayers < dto.playersCount) {
      throw new BadRequestException(
        `Максимальное количество игроков для этого пространства: ${space.maxPlayers}`,
      );
    }
  }

  private getSessionDateTime(startDate: string, visitTime: string): Date {
    const [day, month, year] = startDate.toString().split('.').map(Number);
    const [startHour] = visitTime.split('-');
    return new Date(year, month - 1, day, +startHour.split(':')[0]);
  }

  private validateSessionDateTime(sessionDateTime: Date) {
    if (sessionDateTime.getTime() < Date.now()) {
      throw new BadRequestException('Нельзя бронировать в прошлом');
    }

    const maxBookingDate = addDays(new Date(), 90);
    if (sessionDateTime > maxBookingDate) {
      throw new BadRequestException(
        'Нельзя бронировать более чем на 90 дней вперед',
      );
    }
  }

  private calculateBookingPrice(space: any, playersCount: number): number {
    return space.minPrice * playersCount;
  }

  async cancelBooking(bookingId: string, currentUser: UserTokenDto) {
    const booking = await this.findBookingOwner(bookingId, currentUser.id);
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

    const startDate = new Date();
    const endDate = addDays(new Date(), time);

    return await this.prismaService.bookings.findMany({
      where: {
        userId: currentUser.id,
        startDate: {
          gte: startDate,
          lte: endDate,
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
      include: {
        spaces: { include: { medias: true } },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found!');
    }

    return booking;
  }

  async getBookingComments(
    bookingId: string,
    currentUser: UserTokenDto,
  ): Promise<CommentType[]> {
    const booking = await this.getOneBooking(bookingId, currentUser);

    return await this.prismaService.comments.findMany({
      where: { bookingId: booking.id },
    });
  }

  async addParticipiants(
    bookingId: string,
    dto: AddParticipiantsToBookingDto,
    currentUser: UserTokenDto,
  ) {
    await this.findBookingOwner(bookingId, currentUser.id);

    const player = await this.userCommonService.findUserByEmail(dto.email);

    await this.checkBookingParticipiants(bookingId);

    await this.prismaService.bookingParticipiants.create({
      data: { bookingId, userId: player.id, email: dto.email },
    });

    await this.mailService.sendBookingParticipiantVerificationMail(
      dto.email,
      `${this.backendUrl}/api/bookings/participiants/verifiy?bookingId=${bookingId}&userId=${player.id}`,
    );

    return {
      message:
        'Player added to booking participinat.Verification link sent to email',
    };
  }

  async verifiyBookingParticipiant(
    bookingId: string,
    userId: string,
    currentUser: UserTokenDto,
  ) {
    if (currentUser.id !== userId) {
      throw new ForbiddenException('You are not allowed to do this');
    }
    const booking = await this.findBookingById(bookingId);

    const bookingParticipiant =
      await this.prismaService.bookingParticipiants.findFirst({
        where: { bookingId: booking.id, userId },
      });

    if (!bookingParticipiant) {
      throw new NotFoundException(
        'Booking participiant not found! Maybe you are not participiant',
      );
    }

    await this.prismaService.bookingParticipiants.update({
      where: { id: bookingParticipiant.id },
      data: { isVerified: true },
    });

    return { message: 'Booking participiant verified!' };
  }

  private async checkBookingParticipiants(bookingId: string) {
    const booking = await this.prismaService.bookings.findUnique({
      where: {
        id: bookingId,
        bookingParticipiants: { every: { isVerified: true } },
      },
      include: { bookingParticipiants: true },
    });

    if (booking.bookingParticipiants.length >= booking.playersCount) {
      throw new ConflictException('Booking is full');
    }
  }

  private async findBookingById(bookingId: string) {
    const booking = await this.prismaService.bookings.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found!');
    }

    return booking;
  }

  private async findBookingOwner(bookingId: string, userId: string) {
    const booking = await this.prismaService.bookings.findUnique({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found! Maybe you are not owner');
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
