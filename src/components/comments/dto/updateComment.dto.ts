import { PickType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommentType } from 'src/helpers/types/comment.type';

export class UpdateCommentDto extends PartialType(
  PickType(CommentType, ['comment']),
) {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
