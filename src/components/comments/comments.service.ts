import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { CommentCommonService } from '../common/commentCommon/commentCommon.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private prismaService: PrismaService,
    private commentCommonService: CommentCommonService,
  ) {}

  async createComment(
    dto: CreateCommentDto,
    currentUser: UserTokenDto,
    bookingId: string,
  ) {
    const comment = await this.prismaService.comments.create({
      data: { comment: dto.comment, userId: currentUser.id, bookingId },
    });

    return { message: 'Comments created successfully!', comment };
  }

  async updateComment(
    dto: UpdateCommentDto,
    commentId: string,
    currentUser: UserTokenDto,
  ) {
    const comment = await this.commentCommonService.findCommentById(
      commentId,
      currentUser.id,
    );

    const updatedComment = await this.prismaService.comments.update({
      where: { id: comment.id },
      data: { comment: dto.comment },
    });

    return { message: 'Comment updated successfully!', updatedComment };
  }

  async deleteComment(commentId: string, currentUser: UserTokenDto) {
    const comment = await this.commentCommonService.findCommentById(
      commentId,
      currentUser.id,
    );

    await this.prismaService.comments.delete({ where: { id: comment.id } });

    return { message: 'Comment deleted successfully!' };
  }
}