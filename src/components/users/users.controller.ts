import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { USER } from 'src/common/decorators/isUser.decorator';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { UsersType } from 'src/helpers/types/users/users.type';
import { UserTokenDto } from '../token/dto/token.dto';
import { DeleteAccountOperation } from './decorators/deleteAccountOperation.decorator';
import { DeleteProfilePictureOperation } from './decorators/deleteProfilePictureOperation.decorator';
import { GetMeOperation } from './decorators/getMeOperation.decorator';
import { UpdateProfileOperation } from './decorators/updateProfileOperation.decorator';
import { UploadProfilePictureOperation } from './decorators/uploadProfilePictureOperation.decorator';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';
import { UpdateUserProfile } from './response/updateUserProfile.response';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@USER()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @GetMeOperation()
  async getMe(@CurrentUser() currentUser: UserTokenDto): Promise<UsersType> {
    return await this.usersService.getMe(currentUser);
  }

  @Patch()
  @UpdateProfileOperation()
  async updateProfile(
    @CurrentUser() currentUser: UserTokenDto,
    @Body() dto: UpdateUserProfileDto,
  ): Promise<UpdateUserProfile> {
    return await this.usersService.updateProfile(currentUser, dto);
  }

  @DeleteAccountOperation()
  @Delete()
  async deleteAccount(
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    return this.usersService.deleteAccount(currentUser);
  }

  @UploadProfilePictureOperation()
  @Post('profile/picture')
  async uploadProfilePicture(
    @UploadedFile(ImageTransformer) file: ITransformedFile,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    if (!file) {
      throw new BadRequestException('File not provided!');
    }
    return await this.usersService.uploadProfilePicture(currentUser, file);
  }

  @DeleteProfilePictureOperation()
  @Delete('profile/picture')
  async deleteProfilePicture(
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    return await this.usersService.deleteProfilePicture(currentUser);
  }
}
