import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthProviders, Users } from '@prisma/client';
import { SuccessMessageType } from 'src/helpers/common/successMessage.type';
import { generateHash, verifyHash } from 'src/helpers/providers/generateHash';
import { generateResetPasswordLink } from 'src/helpers/providers/generateResetPasswordLink';
import { generateVerificationCodeAndExpiry } from 'src/helpers/providers/generateVerificationCode';
import { UsersType } from 'src/helpers/types/users/users.type';
import { RedisService } from 'src/libs/redis/redis.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { UserCommonService } from '../common/userCommon/userCommon.service';
import { UserTokenDto } from '../token/dto/token.dto';
import { TokenService } from '../token/token.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserForgotPasswordDto } from './dto/userForgotPassword.dto';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserRefreshTokenDto } from './dto/userRefreshToken.dto';
import { UserRegistrationDto } from './dto/userRegistration.dto';
import { UserVerificationDto } from './dto/userVerification.dto';
import { UserForgotPasswordResponse } from './responses/userForgotPassword.response';
import { UserForgotPasswordVerificationResponse } from './responses/userForgotPasswordVerification.response';
import { UserLoginResponse } from './responses/userLogin.response';
import { UserRefreshResponse } from './responses/userRefresh.response';
import { UserRegistrationResponse } from './responses/userRegistration.response';
import { UserResendVerificationCodeResponse } from './responses/userResendVerificationCode.response';
import { UserVerifyResponse } from './responses/userVerify.response';
import { ValidateResetPasswordResponse } from './responses/validateResetPasswordLink.response';

@Injectable()
export class AuthService {
  private backendUrl: string;
  private logger = new Logger(AuthService.name);
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userCommonService: UserCommonService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.backendUrl = this.configService.getOrThrow<string>('BACKEND_URL');
  }

  async userRegistration(
    dto: UserRegistrationDto,
  ): Promise<UserRegistrationResponse> {
    const { email, password, role } = dto;
    this.logger.log('Начало процесса регистрации пользователя...');

    await this.checkUserExistence(email);

    const hashedPassword = await generateHash(password);
    const code = generateVerificationCodeAndExpiry();

    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const user = await prisma.users.create({
          data: {
            email,
            password: hashedPassword,
            role,
            provider: AuthProviders.email,
          },
        });

        await this.redisService.setEmailVerificationWithExpiry(
          `${user.id}:${user.email}`,
          code,
        );

        this.logger.log('Регистрация пользователя успешно завершена');

        return { message: 'Регистрация пользователя успешна', user };
      });
    } catch (error: any) {
      this.handleRegistrationError(error);
    }
  }

  async userVerification(
    dto: UserVerificationDto,
    userId: string,
  ): Promise<UserVerifyResponse> {
    this.logger.log('Проверка подлинности пользователя...');
    const user = await this.userCommonService.findUserById(userId);
    this.checkUserExistenceForVerification(user);

    await this.validateVerificationCode(dto, user);

    const verifiedUser = await this.verifyUser(user);

    const tokens = this.tokenService.generateTokens({
      ...new UserTokenDto(verifiedUser),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    return { user, message: 'Пользователь успешно подтвержден', ...tokens };
  }

  async resendVerificationCode(
    userId: string,
  ): Promise<UserResendVerificationCodeResponse> {
    this.logger.log('Повторная отправка кода подтверждения...');
    const user = await this.userCommonService.findUserById(userId);
    this.checkUserExistenceForVerification(user);

    const code = generateVerificationCodeAndExpiry();

    await this.redisService.setEmailVerificationWithExpiry(
      `${user.id}:${user.email}`,
      code,
    );

    this.logger.log('Код подтверждения успешно отправлен:', code);
    return { message: 'Код подтверждения успешно отправлен', user };
  }

  async userLogin(dto: UserLoginDto): Promise<UserLoginResponse> {
    this.logger.log('Попытка входа пользователя...');
    const user = await this.userCommonService.findUserByEmail(dto.email);
    this.checkUserExistenceForLogin(user, dto.email);

    const isPasswordCorrect = await verifyHash(dto.password, user.password);

    if (!isPasswordCorrect) {
      this.logger.error('Неверный пароль');
      throw new BadRequestException('Неверный пароль!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new UserTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log('Успешный вход пользователя:', user);
    return { message: 'Успешный вход пользователя!', user, ...tokens };
  }

  async logoutUser(dto: UserRefreshTokenDto): Promise<SuccessMessageType> {
    if (!dto.refreshToken) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    await this.tokenService.deleteToken(dto.refreshToken);

    return { message: 'User logged out' };
  }

  async refreshTokens(dto: UserRefreshTokenDto): Promise<UserRefreshResponse> {
    this.logger.log('Попытка обновления токенов...');
    if (!dto.refreshToken) {
      this.logger.error('Не предоставлен обновляющий токен!');
      throw new UnauthorizedException('Refresh token not provided!');
    }

    const tokenFromDB = await this.tokenService.findToken(dto.refreshToken);
    const validToken = this.tokenService.validateRefreshToken(dto.refreshToken);

    if (!validToken || !tokenFromDB) {
      this.logger.error('Неверный токен!');
      throw new UnauthorizedException('Invalid token!');
    }

    const user = await this.userCommonService.findUserById(validToken.id);

    if (!user) {
      this.logger.error('Пользователь не найден!');
      throw new NotFoundException('User not found!');
    }

    const tokens = this.tokenService.generateTokens({
      ...new UserTokenDto(user),
    });

    await this.tokenService.saveTokens(user.id, tokens.refreshToken);

    this.logger.log('Токены успешно обновлены:');

    return { message: 'Токены успешно обновлены', user, ...tokens };
  }

  async forgotPassword(
    dto: UserForgotPasswordDto,
  ): Promise<UserForgotPasswordResponse> {
    this.logger.log('Начало процесса сброса пароля...');
    const user = await this.userCommonService.findUserByEmail(dto.email);

    if (!user) {
      this.logger.error('Пользователь не найден!');
      throw new NotFoundException('User not found!');
    }

    const code = generateVerificationCodeAndExpiry();

    await this.redisService.setEmailVerificationWithExpiry(
      `${user.id}:${user.email}`,
      code,
    );

    await this.prismaService.users.update({
      where: { id: user.id },
      data: {
        isVerified: false,
      },
    });

    this.logger.log('Код сброса пароля успешно отправлен:', code);
    return { message: 'Код сброса пароля успешно отправлен', id: user.id };
  }

  async forgotPasswordVerification(
    dto: UserVerificationDto,
    userId: string,
  ): Promise<UserForgotPasswordVerificationResponse> {
    this.logger.log('Начало процесса верификации сброса пароля...');
    const user = await this.userCommonService.findUserById(userId);
    if (!user) {
      this.logger.error('Пользователь не найден!');
      throw new NotFoundException('Пользователь не найден!');
    }
    if (user.isVerified) {
      this.logger.error('Пользователь уже верифицирован!');
      throw new BadRequestException('User already verified');
    }

    await this.validateVerificationCode(dto, user);

    await this.verifyUser(user);

    const resetToken = this.tokenService.generateResetToken({
      ...new UserTokenDto(user),
    });
    const link = this.generateResetPasswordLink(user, resetToken);
    await this.redisService.setResetPasswordLinkWithExpiry(
      `${user.id}:${resetToken}`,
      link,
    );

    this.logger.log('Пароль успешно верифицирован:', link);
    return { link, message: 'Password verified successfully!' };
  }

  async validateResetPasswordLink(
    resetToken: string,
    userId: string,
  ): Promise<ValidateResetPasswordResponse> {
    this.logger.log('Валидация ссылки для сброса пароля...');
    const token = await this.tokenService.validateResetToken(resetToken);

    if (!token) {
      this.logger.error('Истек срок действия токена сброса пароля');
      throw new UnauthorizedException('Reset token is expired');
    }

    const key = `${userId}:${resetToken}`;
    const verificationKey =
      await this.redisService.getResetPasswordVerificationLink(key);
    if (!verificationKey) {
      this.logger.error('Истек срок действия ссылки для сброса пороля');
      throw new BadRequestException('Reset password verification link expired');
    }

    await this.redisService.deleteResetPasswordVerificationLink(key);

    this.logger.log('Ссылка для сброса пароля верифицирована');
    return { message: 'Reset password link is verified', resetToken };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    userId: string,
  ): Promise<SuccessMessageType> {
    this.logger.log('Начало процесса сброса пароля пользователя...');
    const user = await this.userCommonService.findUserById(userId);

    if (!user) {
      this.logger.error('Пользователь не найден!');
      throw new NotFoundException('User not found!');
    }

    const hashedPassword = await generateHash(dto.password);

    await this.prismaService.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    this.logger.log('Пароль пользователя успешно обновлен');
    return { message: 'User password updated successfully!' };
  }

  private async checkUserExistence(email: string) {
    this.logger.log('Проверка существования пользователя...');
    const user = await this.userCommonService.findUserByEmail(email);
    if (user || user?.email) {
      this.logger.error(
        `Пользователь с адресом электронной почты ${email} уже существует`,
      );
      throw new ConflictException(`User with email ${email} already exists!`);
    }

    if (user || user?.provider === 'google') {
      throw new BadRequestException(
        'You need to authorize with google and set password to use this type of authorization!',
      );
    }
  }

  private checkUserExistenceForVerification(user: Users) {
    if (!user) {
      this.logger.error('Пользователь не найден');
      throw new NotFoundException('Пользователь не найден');
    }
    if (user.isVerified) {
      this.logger.error('Пользователь уже подтвержден');
      throw new BadRequestException('Пользователь уже подтвержден');
    }
  }

  private checkUserExistenceForLogin(user: Users, email: string) {
    if (!user) {
      this.logger.error(`Пользователь с почтой ${email} не найден`);
      throw new NotFoundException(`Пользователь с почтой ${email} не найден!`);
    }

    if (!user.isVerified) {
      this.logger.error('Пользователь не подтвержден');
      throw new BadRequestException('Пользователь не подтвержден');
    }
  }

  private handleRegistrationError(error: any) {
    if (!(error instanceof ConflictException)) {
      this.logger.error('Ошибка регистрации пользователя: ', error.message);
      throw new BadRequestException('Ошибка регистрации пользователя');
    }
    throw error;
  }

  private async validateVerificationCode(
    dto: UserVerificationDto,
    user: Users,
  ) {
    this.logger.log('Проверка кода верификации...');
    const verificationCode = await this.redisService.getEmailVerificationCode(
      `${user.id}:${user.email}`,
    );
    if (!verificationCode) {
      throw new BadRequestException('Verification code is expired');
    }
    if (verificationCode !== dto.verificationCode) {
      throw new BadRequestException('Verification code is wrong');
    }
  }

  private async verifyUser(user: Users): Promise<UsersType> {
    this.logger.log('Верификация пользователя...');
    return await this.prismaService.users.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  private generateResetPasswordLink(user: Users, resetToken: string): string {
    this.logger.log('Генерация ссылки для сброса пароля...');
    return generateResetPasswordLink(this.backendUrl, resetToken, user.id);
  }
}
