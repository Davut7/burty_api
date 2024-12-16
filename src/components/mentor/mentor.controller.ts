import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { MENTOR } from 'src/common/decorators/isMentor.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { MentorService } from './mentor.service';

@ApiTags('mentor')
@ApiBearerAuth()
@MENTOR()
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@CurrentUser() currentUser: UserTokenDto) {
    return this.mentorService.getMe(currentUser.id);
  }

  @Get('linked-spaces')
  @HttpCode(HttpStatus.OK)
  async getLinkedSpaces(@CurrentUser() currentUser: UserTokenDto) {
    return this.mentorService.getLinkedSpaces(currentUser.id);
  }

  @Get('linked-spaces/:spaceId')
  @HttpCode(HttpStatus.OK)
  async getOneLinkedSpace(
    @CurrentUser() currentUser: UserTokenDto,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ) {
    return this.mentorService.getOneLinkedSpace(currentUser.id, spaceId);
  }
}
