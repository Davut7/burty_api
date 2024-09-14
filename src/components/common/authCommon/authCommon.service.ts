import { Injectable, Logger } from '@nestjs/common';
import { UserSocialRegistrationDto } from 'src/components/auth/dto/userSocialRegistration.dto';
import { UserTokenDto } from 'src/components/token/dto/token.dto';
import { TokenService } from 'src/components/token/token.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class AuthCommonService {
  logger = new Logger(AuthCommonService.name);
  constructor(
    private prismaService: PrismaService,
    private tokenService: TokenService,
  ) {}

  async loginOrRegistration(dto: UserSocialRegistrationDto) {
    this.logger.log('Проверка существования пользователя в базе данных...');
    const userFromDb = await this.prismaService.users.findUnique({
      where: { email: dto.email },
    });

    if (userFromDb) {
      this.logger.log(`Пользователь с email ${dto.email} найден в базе данных`);

      const tokens = this.tokenService.generateTokens({
        ...new UserTokenDto(userFromDb),
      });
      await this.tokenService.saveTokens(userFromDb.id, tokens.refreshToken);

      this.logger.log(
        `Токены успешно сгенерированы для пользователя с ID ${userFromDb.id}`,
      );
      return {
        message: 'User login successful!',
        user: userFromDb,
        ...tokens,
      };
    }

    this.logger.log(
      `Пользователь с email ${dto.email} не найден, создаем нового пользователя...`,
    );
    const newUser = await this.prismaService.users.create({ data: { ...dto } });
    this.logger.log(`Создан новый пользователь с ID ${newUser.id}`);

    const tokens = this.tokenService.generateTokens({
      ...new UserTokenDto(newUser),
    });
    await this.tokenService.saveTokens(newUser.id, tokens.refreshToken);

    this.logger.log(
      `Токены успешно сгенерированы для нового пользователя с ID ${newUser.id}`,
    );
    return {
      message: 'User login successful!',
      user: newUser,
      ...tokens,
    };
  }
}
