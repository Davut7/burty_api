import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MENTOR } from 'src/common/decorators/isMentor.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { CommentsService } from './comments.service';
import { CreateCommentOperation } from './decorators/createCommentOperation.decorator';
import { DeleteCommentOperation } from './decorators/deleteCommentOperation.decorator';
import { UpdateCommentOperation } from './decorators/updateCommentOperation.decorator';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@MENTOR()
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

  @Patch(':commentId')
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
