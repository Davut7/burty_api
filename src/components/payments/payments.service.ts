import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { BookingCommonService } from '../common/bookingCommon/bookingCommon.service';
import * as QRCode from 'qrcode';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe'; //
import { join } from 'path';
import { unlink, stat } from 'fs/promises';
import { MediaService } from 'src/libs/media/media.service';

@Injectable()
export class PaymentsService {
  constructor(
    private prismaService: PrismaService,
    private bookingCommonService: BookingCommonService,
    private mediaService: MediaService,
    private imageTransformer: ImageTransformer,
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

    const qrCodeData = JSON.stringify({
      bookingId: booking.id,
      userId: currentUser.id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      playerCount: booking.playersCount,
      startDate: booking.startDate.toISOString(),
      passType: booking.passType,
      price: booking.price,
    });

    const qrCodeFileName = `booking_${booking.id}.png`;
    const qrCodeFilePath = join('./temp', qrCodeFileName);

    await QRCode.toFile(qrCodeFilePath, qrCodeData, { width: 256 });

    try {
      const fileStats = await stat(qrCodeFilePath);

      const file: Express.Multer.File = {
        filename: qrCodeFileName,
        originalname: qrCodeFileName,
        path: qrCodeFilePath,
        destination: './temp',
        mimetype: 'image/png',
        size: fileStats.size,
      } as Express.Multer.File;

      const transformedFile = await this.imageTransformer.transform(file);

      const qrcode = await this.prismaService.qrCodes.create({
        data: {
          bookingId: booking.id,
          userId: currentUser.id,
        },
      });

      await this.mediaService.createFileMedia(
        transformedFile,
        qrcode.id,
        'qrCodeId',
      );
    } catch (err) {
      console.error(`Error processing file ${qrCodeFileName}:`, err);
      await unlink(qrCodeFilePath);
      throw new InternalServerErrorException(
        'Failed to process QR code. Please check server logs for details.',
      );
    }

    return { message: 'Booking paid and QR code generated!' };
  }
}
