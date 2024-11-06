import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class ReviewsCommonService {
  constructor(private prismaService: PrismaService) {}
  async checkBookingToReview(spaceId: string, userId: string) {
    const booking = await this.prismaService.bookings.findFirst({
      where: { userId, spaceId },
    });
    if (!booking) {
      throw new ConflictException(
        'You cannot add review if not booked this space yet',
      );
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
