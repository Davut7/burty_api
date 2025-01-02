import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { MENTOR } from 'src/common/decorators/isMentor.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { GetBookingByQrCodeOperation } from './decorators/getBookingByQrCodeOperation.decorator';
import { GetLinkedSpaceBookingsOperation } from './decorators/getLinkedSpaceBookingsOperation.decorator';
import { GetLinkedSpacesOperation } from './decorators/getLinkedSpacesOperation.decorator';
import { GetMeOperation } from './decorators/getMeOperation.decorator';
import { GetOneLinkedSpaceOperation } from './decorators/getOnelinkSpaceOperation.decorator';
import { MentorService } from './mentor.service';

@ApiTags('mentor')
@ApiBearerAuth()
@MENTOR()
@Controller('mentor')
export class MentorController {
  constructor(private readonly mentorService: MentorService) {}

  @Get('me')
  @GetMeOperation()
  async getMe(@CurrentUser() currentUser: UserTokenDto) {
    return this.mentorService.getMe(currentUser.id);
  }

  @Get('linked-spaces')
  @GetLinkedSpacesOperation()
  async getLinkedSpaces(@CurrentUser() currentUser: UserTokenDto) {
    return this.mentorService.getLinkedSpaces(currentUser.id);
  }

  @Get('linked-spaces/:spaceId')
  @GetOneLinkedSpaceOperation()
  async getOneLinkedSpace(
    @CurrentUser() currentUser: UserTokenDto,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ) {
    return this.mentorService.getOneLinkedSpace(currentUser.id, spaceId);
  }

  @Get('linked-spaces/:spaceId/bookings')
  @GetLinkedSpaceBookingsOperation()
  async getLinkedSpaceBookings(
    @CurrentUser() currentUser: UserTokenDto,
    @Param('spaceId', ParseUUIDPipe) spaceId: string,
  ) {
    return await this.mentorService.getBookingsByLinkedSpace(
      spaceId,
      currentUser,
    );
  }

  @Get('bookings/:userId')
  @GetBookingByQrCodeOperation()
  async getBookingByQrCode(
    @Param('userId', ParseUUIDPipe) userId: string,
    @CurrentUser() currentUser: UserTokenDto,
  ) {
    return await this.mentorService.getBookingByQrCode(userId, currentUser);
  }
}
