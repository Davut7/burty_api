import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class CommentCommonService {
  constructor(private prismaService: PrismaService) {}

  async findCommentBySpaceId() {}

  async findCommentById(commentId: string) {
    const comment = await this.prismaService.comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }

    return comment;
  }
}
