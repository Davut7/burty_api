import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PassType } from '@prisma/client';
import { addDays } from 'date-fns';
import { createReadStream } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as QRCode from 'qrcode';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { MediaService } from 'src/libs/media/media.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { CreateBookingDto } from './dto/createBooking.dto';
import { BookingTimeEnum, GetBookingsQuery } from './query/getBookings.query';
@Injectable()
export class BookingService {
  constructor(
    private prismaService: PrismaService,
    private mediaService: MediaService,
    private imageTransformer: ImageTransformer,
  ) {}

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

    const maxBookingDate = addDays(new Date(), 90);
    if (sessionDateTime > maxBookingDate) {
      throw new BadRequestException(
        'Нельзя бронировать более чем на 90 дней вперед',
      );
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

    const booking = await this.prismaService.bookings.create({
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

    const qrData = {
      bookingId: booking.id,
      spaceId,
      userId: currentUser.id,
      startDate: sessionDateTime,
      passType: dto.passType,
      startTime: startHour,
      endTime: endHour,
    };

    const qrCodePath = `./temp/qr-code-${booking.id}.png`;
    await QRCode.toFile(qrCodePath, JSON.stringify(qrData));

    const fileBuffer = await fs.readFile(qrCodePath);
    const stats = await fs.stat(qrCodePath);

    const multerFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: path.basename(qrCodePath),
      encoding: '7bit',
      mimetype: 'image/png',
      size: stats.size,
      buffer: fileBuffer,
      destination: './temp',
      filename: path.basename(qrCodePath),
      path: qrCodePath,
      stream: createReadStream(qrCodePath),
    };

    const transformedFile = await this.imageTransformer.transform(multerFile);
    const qrCode = await this.prismaService.qrCodes.create({
      data: {
        bookingId: booking.id,
        userId: currentUser.id,
      },
    });

    await this.mediaService.createFileMedia(
      transformedFile,
      qrCode.id,
      'qrCodeId',
    );

    return booking;
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
        qrCode: { include: { medias: true } },
      },
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
