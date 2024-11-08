import { Controller, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { UserTokenDto } from '../token/dto/token.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateCommentOperation } from './decorators/createCommentOperation.decorator';
import { UpdateCommentOperation } from './decorators/updateCommentOperation.decorator';
import { DeleteCommentOperation } from './decorators/deleteCommentOperation.decorator';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':bookingId')
  @CreateCommentOperation()
  async createComment(
    @Body() dto: CreateCommentDto,
    @Param('bookingId') bookingId: string,
    currentUser: UserTokenDto,
  ) {
    return this.commentsService.createComment(dto, currentUser, bookingId);
  }

  @Put(':commentId')
  @UpdateCommentOperation()
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() dto: UpdateCommentDto,
    currentUser: UserTokenDto,
  ) {
    return this.commentsService.updateComment(dto, commentId, currentUser);
  }

  @Delete(':commentId')
  @DeleteCommentOperation()
  async deleteComment(
    @Param('commentId') commentId: string,
    currentUser: UserTokenDto,
  ) {
    return this.commentsService.deleteComment(commentId, currentUser);
  }
}
