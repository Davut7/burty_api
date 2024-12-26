import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentType } from 'src/helpers/types/comment.type';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { BookingCommonService } from '../common/bookingCommon/bookingCommon.service';
import { CommentCommonService } from '../common/commentCommon/commentCommon.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prismaService: PrismaService,
    private commentCommonService: CommentCommonService,
    private bookingCommonService: BookingCommonService,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    currentUser: UserTokenDto,
    bookingId: string,
  ) {
    const booking = await this.bookingCommonService.findBookingById(
      bookingId,
      currentUser.id,
    );

    if (!booking) {
      throw new NotFoundException('Booking not found!');
    }

    const comment = await this.prismaService.comments.create({
      data: { comment: dto.comment, mentorId: currentUser.id, bookingId },
    });

    return { message: 'Comments created successfully!', comment };
  }

  async updateComment(
    dto: UpdateCommentDto,
    commentId: string,
    currentUser: UserTokenDto,
  ) {
    const comment = await this.commentCommonService.findCommentById(commentId);

    const updatedComment = await this.prismaService.comments.update({
      where: { id: comment.id, mentorId: currentUser.id },
      data: { comment: dto.comment },
    });

    return { message: 'Comment updated successfully!', updatedComment };
  }

  async deleteComment(commentId: string, currentUser: UserTokenDto) {
    const comment = await this.commentCommonService.findCommentById(commentId);

    await this.prismaService.comments.delete({
      where: { id: comment.id, mentorId: currentUser.id },
    });

    return { message: 'Comment deleted successfully!' };
  }

  async getComments(
    bookingId: string,
    currentUser: UserTokenDto,
  ): Promise<CommentType[]> {
    return await this.prismaService.comments.findMany({
      where: { bookingId, mentorId: currentUser.id },
    });
  }
}
