import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { ReviewsCommonService } from '../common/reviewsCommon/reviewsCommon.service';

@Injectable()
export class ReviewsService {
  constructor(
    private prismaService: PrismaService,
    private reviewsCommonService: ReviewsCommonService,
  ) {}

  async createReview(
    dto: CreateReviewDto,
    spaceId: string,
    currentUser: UserTokenDto,
  ) {
    await this.reviewsCommonService.checkBookingToReview(
      spaceId,
      currentUser.id,
    );
    return await this.prismaService.reviews.create({
      data: { ...dto, spaceId, userId: currentUser.id },
    });
  }

  async updateReview(
    reviewId: string,
    dto: UpdateReviewDto,
    currentUser: UserTokenDto,
  ) {
    const review = await this.reviewsCommonService.findUserReviewById(
      reviewId,
      currentUser.id,
    );
    await this.prismaService.reviews.update({
      where: { id: review.id },
      data: { ...dto },
    });

    return review;
  }

  async deleteReview(reviewId: string, currentUser: UserTokenDto) {
    const review = await this.reviewsCommonService.findUserReviewById(
      reviewId,
      currentUser.id,
    );
    await this.prismaService.reviews.delete({ where: { id: review.id } });
    return { message: 'Review deleted successfully!' };
  }

  async getReviewsBySpaceId(spaceId: string) {
    return await this.prismaService.reviews.findMany({
      where: { spaceId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
          include: { media: true },
        },
      },
    });
  }
}
