import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { MediaService } from 'src/libs/media/media.service';
import { MediaType } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prismaService: PrismaService,
    private mediaService: MediaService,
  ) {}

  async uploadProfilePicture(
    currentUser: UserTokenDto,
    file: ITransformedFile,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Загрузка фото профиля для пользователя с ID: ${currentUser.id}`,
    );
    const user = await this.findUserById(currentUser.id);

    if (user) {
      const media = await this.prismaService.media.findFirst({
        where: {
          fileType: MediaType.IMAGE,
        },
      });
      if (media) {
        await this.mediaService.deleteOneMedia(media.id);
      }
      await this.mediaService.createFileMedia(file, user.id, 'specialistId');
    } else {
      const media = await this.prismaService.media.findFirst({
        where: { clientId: currentUser.id, fileType: MediaType.IMAGE },
      });
      if (media) {
        await this.mediaService.deleteOneMedia(media.id);
      }
      await this.mediaService.createFileMedia(file, currentUser.id, 'clientId');
    }
    this.logger.log(
      `Фото профиля успешно загружено для пользователя с ID: ${currentUser.id}`,
    );
    return {
      message: 'Фото профиля успешно загружено!',
    };
  }

  async deleteAccount(currentUser: UserTokenDto): Promise<SuccessMessageType> {
    this.logger.log('Удаление аккаунта клиента');
    await this.findUserById(currentUser.id);
    await this.prismaService.users.update({
      where: { id: currentUser.id },
      data: { isDeleted: true },
    });
    this.logger.log('Аккаунт клиента успешно удален');
    return {
      message: 'User account deleted successfully',
    };
  }

  async deleteProfilePicture(
    currentUser: UserTokenDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Удаление фото профиля для пользователя с ID: ${currentUser.id}`,
    );
    const user = await this.findUserById(currentUser.id);

    const media = await this.prismaService.media.findFirst({
      where: {
        clientId: currentUser.id,
        fileType: MediaType.IMAGE,
      },
    });
    if (!media) {
      this.logger.error(
        `Фото профиля уже удалено для пользователя с ID: ${currentUser.id}`,
      );
      throw new BadRequestException('You already deleted profile picture');
    }
    await this.mediaService.deleteOneMedia(media.id);
    this.logger.log(
      `Фото профиля успешно удалено для пользователя с ID: ${currentUser.id}`,
    );

    return {
      message: 'Profile picture deleted successfully',
    };
  }

  private async findUserById(userId: string) {
    this.logger.log('Поиск пользователя по id');
    const user = await this.prismaService.users.findFirst({
      where: { id: userId },
    });
    if (!user) {
      this.logger.error(`Пользователя с ID: ${userId} не найден`);
      throw new NotFoundException('User not found!');
    }
    this.logger.log('Пользователя по id найден');
    return user;
  }
}
