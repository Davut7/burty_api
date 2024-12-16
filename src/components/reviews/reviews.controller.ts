import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { USER } from 'src/common/decorators/isUser.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { CreateReviewOperation } from './decorators/createReviewOperation.decorator';
import { DeleteReviewOperation } from './decorators/deleteReviewOperation.decorator';
import { GetReviewsBySpaceIdOperation } from './decorators/getReviewsBySpaceIdOperation.decorator';
import { UpdateReviewOperation } from './decorators/updateReviewOperation.decorator';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@ApiBearerAuth()
@USER()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @CreateReviewOperation()
  @Post(':bookingId')
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.reviewsService.createReview(
      createReviewDto,
      bookingId,
      currentUser,
    );
  }

  @UpdateReviewOperation()
  @Patch(':reviewId')
  @HttpCode(HttpStatus.OK)
  async updateReview(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.reviewsService.updateReview(
      reviewId,
      updateReviewDto,
      currentUser,
    );
  }

  @GetReviewsBySpaceIdOperation()
  @Get(':spaceId')
  async getReviewsBySpaceId(@Param('spaceId', ParseUUIDPipe) spaceId: string) {
    return await this.reviewsService.getReviewsBySpaceId(spaceId);
  }

  @DeleteReviewOperation()
  @Delete(':reviewId')
  @HttpCode(HttpStatus.OK)
  async deleteReview(
    @Param('reviewId', ParseUUIDPipe) reviewId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.reviewsService.deleteReview(reviewId, currentUser);
  }
}
