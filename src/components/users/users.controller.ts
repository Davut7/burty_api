import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserTokenDto } from '../token/dto/token.dto';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { UploadProfilePictureOperation } from './decorators/uploadProfilePictureOperation.decorator';
import { DeleteProfilePictureOperation } from './decorators/deleteProfilePictureOperation.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DeleteAccountOperation } from './decorators/deleteAccountOperation.decorator';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @DeleteAccountOperation()
  @Delete()
  async deleteAccount(
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    return this.usersService.deleteAccount(currentUser);
  }

  @UploadProfilePictureOperation()
  @Post('profile/image')
  async uploadProfilePicture(
    @UploadedFile(ImageTransformer) file: ITransformedFile,
    @CurrentUser() currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    if (!file) throw new BadRequestException('File not provided!');
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
