import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ITransformedFile } from 'src/common/interfaces/fileTransform.interface';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { generateHash } from 'src/helpers/providers/generateHash';
import { UsersType } from 'src/helpers/types/users/users.type';
import { MediaService } from 'src/libs/media/media.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prismaService: PrismaService,
    private mediaService: MediaService,
  ) {}

  async getMe(currentUser: UserTokenDto): Promise<UsersType> {
    const user = await this.prismaService.users.findUnique({
      where: { id: currentUser.id, isDeleted: false },
      include: { media: true },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async uploadProfilePicture(
    currentUser: UserTokenDto,
    image: ITransformedFile,
  ): Promise<SuccessMessageType> {
    this.logger.log(
      `Загрузка фото профиля для пользователя с ID: ${currentUser.id}`,
    );
    const user = await this.findUserById(currentUser.id);

    if (user.media) {
      await this.mediaService.deleteOneMedia(user.media.id);

      await this.mediaService.createFileMedia(image, user.id, 'userId');

      this.logger.log(
        `Фото профиля успешно загружено для пользователя с ID: ${currentUser.id}`,
      );
      return {
        message: 'Фото профиля успешно загружено!',
      };
    }

    await this.mediaService.createFileMedia(image, user.id, 'userId');
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

    if (user.media) {
      await this.mediaService.deleteOneMedia(user.media.id);
      this.logger.log(
        `Фото профиля успешно удалено для пользователя с ID: ${currentUser.id}`,
      );

      return {
        message: 'Profile picture deleted successfully',
      };
    }

    if (!user.media) {
      this.logger.error(
        `Фото профиля уже удалено для пользователя с ID: ${currentUser.id}`,
      );
      throw new BadRequestException('You already deleted profile picture');
    }
  }

  async updateProfile(
    currentUser: UserTokenDto,
    dto: UpdateUserProfileDto,
  ): Promise<SuccessMessageType> {
    this.logger.log(`Обновление профиля пользователя с ID: ${currentUser.id}`);
    const user = await this.findUserById(currentUser.id);

    if (dto.password) {
      dto.password = await generateHash(dto.password);
    }
    await this.prismaService.users.update({
      where: { id: user.id },
      data: { ...dto },
    });

    return { message: 'User profile updated successfully' };
  }

  private async findUserById(userId: string) {
    this.logger.log('Поиск пользователя по id');
    const user = await this.prismaService.users.findFirst({
      where: { id: userId },
      include: { media: true },
    });
    if (!user) {
      this.logger.error(`Пользователя с ID: ${userId} не найден`);
      throw new NotFoundException('User not found!');
    }
    this.logger.log('Пользователя по id найден');
    return user;
  }
}
