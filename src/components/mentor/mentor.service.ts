import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingType } from 'src/helpers/types/booking.type';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserTokenDto } from '../token/dto/token.dto';

@Injectable()
export class MentorService {
  constructor(private prismaService: PrismaService) {}

  async getMe(userId: string) {
    const mentor = await this.prismaService.users.findUnique({
      where: { id: userId },
      include: {
        linkedSpaces: {
          include: {
            space: { include: { medias: true } },
          },
        },
      },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    return mentor;
  }

  async getLinkedSpaces(mentorId: string) {
    const linkedSpaces = await this.prismaService.linkedSpaces.findMany({
      where: { mentorId: mentorId },
      include: {
        space: {
          include: { medias: true, reviews: true },
        },
      },
    });

    return linkedSpaces.map((link) => {
      const { space } = link;
      const averageRating = space.reviews.length
        ? space.reviews.reduce((sum, review) => sum + review.rating, 0) /
          space.reviews.length
        : 0;

      return {
        ...space,
        averageRating,
        reviews: space.reviews,
      };
    });
  }

  async getOneLinkedSpace(mentorId: string, spaceId: string) {
    const linkedSpace = await this.prismaService.linkedSpaces.findFirst({
      where: {
        mentorId: mentorId,
        spaceId,
      },
      include: {
        space: {
          include: { medias: true, reviews: true },
        },
      },
    });

    if (!linkedSpace) {
      throw new NotFoundException('Linked space not found');
    }

    const { space } = linkedSpace;
    const averageRating = space.reviews.length
      ? space.reviews.reduce((sum, review) => sum + review.rating, 0) /
        space.reviews.length
      : 0;

    return {
      ...space,
      averageRating,
      reviews: space.reviews,
    };
  }

  async getBookingByQrCode(bookingId: string): Promise<BookingType> {
    const booking = await this.prismaService.bookings.findFirst({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getBookingsByLinkedSpace(
    spaceId: string,
    currentUser: UserTokenDto,
  ): Promise<BookingType[]> {
    const linkedSpace = await this.getOneLinkedSpace(currentUser.id, spaceId);

    return await this.prismaService.bookings.findMany({
      where: { spaceId: linkedSpace.id },
    });
  }
}
