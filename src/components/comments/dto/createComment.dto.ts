import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CommentType } from 'src/helpers/types/comment.type';

export class CreateCommentDto extends PickType(CommentType, ['comment']) {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
