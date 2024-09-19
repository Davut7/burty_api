import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

@Injectable()
export class ReviewsService {
  constructor(private prismaService: PrismaService) {}

  async createReview(
    dto: CreateReviewDto,
    spaceId: string,
    currentUser: UserTokenDto,
  ) {
    await this.checkBookingToReview(spaceId, currentUser.id);
    return await this.prismaService.reviews.create({
      data: { ...dto, spaceId, userId: currentUser.id },
    });
  }

  async updateReview(
    reviewId: string,
    dto: UpdateReviewDto,
    currentUser: UserTokenDto,
  ) {
    const review = await this.findUserReviewById(reviewId, currentUser.id);
    await this.prismaService.reviews.update({
      where: { id: review.id },
      data: { ...dto },
    });

    return review;
  }

  async deleteReview(reviewId: string, currentUser: UserTokenDto) {
    const review = await this.findUserReviewById(reviewId, currentUser.id);
    await this.prismaService.reviews.delete({ where: { id: review.id } });
    return { message: 'Review deleted successfully!' };
  }

  private async checkBookingToReview(spaceId: string, userId: string) {
    const booking = await this.prismaService.bookings.findFirst({
      where: { userId, spaceId },
    });
    if (!booking) {
      throw new ConflictException(
        'You cannot add review if not booked this space yet',
      );
    }
  }

  private async findUserReviewById(reviewId: string, userId: string) {
    const review = await this.prismaService.reviews.findFirst({
      where: { userId, id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found!');
    }

    return review;
  }
}
