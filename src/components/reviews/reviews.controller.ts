import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { USER } from 'src/common/decorators/isUser.decorator';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { CreateReviewOperation } from './decorators/createReviewOperation.decorator';
import { UpdateReviewOperation } from './decorators/updateReviewOperation.decorator';
import { DeleteReviewOperation } from './decorators/deleteReviewOperation.decorator';

@ApiTags('reviews')
@ApiBearerAuth()
@USER()
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @CreateReviewOperation()
  @Post(':spaceId')
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Param('spaceId') spaceId: string,
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.reviewsService.createReview(
      createReviewDto,
      spaceId,
      currentUser,
    );
  }

  @UpdateReviewOperation()
  @Patch(':reviewId')
  @HttpCode(HttpStatus.OK)
  async updateReview(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.reviewsService.updateReview(
      reviewId,
      updateReviewDto,
      currentUser,
    );
  }

  @DeleteReviewOperation()
  @Delete(':reviewId')
  @HttpCode(HttpStatus.OK)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return this.reviewsService.deleteReview(reviewId, currentUser);
  }
}
