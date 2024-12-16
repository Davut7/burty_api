import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class ReviewsCommonService {
  constructor(private prismaService: PrismaService) {}
  async checkBookingToReview(bookingId: string, userId: string) {
    const booking = await this.prismaService.bookings.findFirst({
      where: {
        userId,
        id: bookingId,
        status: 'paid',
        isArchived: true,
      },
    });

    if (!booking) {
      throw new ConflictException(
        'You cannot add review if not booked this space yet, not paid for it, or not used your booking',
      );
    }

    return booking;
  }

  async checkReviewExists(spaceId: string, userId: string) {
    const review = await this.prismaService.reviews.findFirst({
      where: { spaceId, userId },
    });

    if (review) {
      throw new ConflictException('You already added a review for this space');
    }
  }

  async findUserReviewById(reviewId: string, userId: string) {
    const review = await this.prismaService.reviews.findFirst({
      where: { userId, id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found!');
    }

    return review;
  }
}
