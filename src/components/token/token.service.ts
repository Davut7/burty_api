import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserTokenDto } from './dto/token.dto';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  generateTokens(payload: UserTokenDto) {
    const accessToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_TIME'),
      },
    );
    const refreshToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_TIME'),
      },
    );

    this.logger.log(`Generated tokens for user with ID ${payload.id}`);

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveTokens(userId: string, refreshToken: string) {
    const user = await this.prismaService.userTokens.findFirst({
      where: { userId: userId },
    });

    if (user) {
      this.logger.log(`Updating refresh token for user with ID ${userId}`);
      const updateExistingToken = await this.prismaService.userTokens.update({
        where: { userId: userId },
        data: { refreshToken },
      });
      return updateExistingToken;
    }

    this.logger.log(`Saving refresh token for user with ID ${userId}`);
    const token = this.prismaService.userTokens.create({
      data: { refreshToken: refreshToken, userId: userId },
    });
    return token;
  }

  validateAccessToken(accessToken: string) {
    try {
      const token = jwt.verify(
        accessToken,
        this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      );

      this.logger.log(`Validated access token`);

      return token as UserTokenDto;
    } catch (err: any) {
      this.logger.error(`Failed to validate access token: ${err.message}`);
      throw new UnauthorizedException();
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const token = jwt.verify(
        refreshToken,
        this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      );

      this.logger.log(`Validated refresh token`);

      return token as UserTokenDto;
    } catch (err: any) {
      this.logger.error(`Failed to validate refresh token: ${err.message}`);
      throw new UnauthorizedException('Invalid token!');
    }
  }

  async deleteToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);

    if (!token) {
      throw new NotFoundException('Refresh token not found!');
    }

    this.logger.log(`Deleting refresh token`);
    await this.prismaService.userTokens.delete({
      where: { id: token.id },
    });
    return { message: 'Token deleted successfully.' };
  }

  async findToken(refreshToken: string) {
    try {
      const token = await this.prismaService.userTokens.findFirst({
        where: { refreshToken: refreshToken },
      });
      return token;
    } catch (err: any) {
      this.logger.error(`Failed to find token: ${err.message}`);
      throw new UnauthorizedException(
        'Token not found! Please register first!',
      );
    }
  }

  generateResetToken(payload: UserTokenDto) {
    const resetToken = jwt.sign(
      payload,
      this.configService.getOrThrow<string>('JWT_RESET_SECRET'),
      {
        expiresIn: this.configService.getOrThrow<string>('JWT_RESET_TIME'),
      },
    );

    this.logger.log(`Generated reset token for user with ID ${payload.id}`);

    return resetToken;
  }

  async validateResetToken(resetToken: string) {
    try {
      const token = jwt.verify(
        resetToken,
        this.configService.getOrThrow<string>('JWT_RESET_SECRET'),
      );

      this.logger.log(`Validated reset token`);

      return token as UserTokenDto;
    } catch (err: any) {
      this.logger.error(`Failed to validate reset token: ${err.message}`);
      throw new UnauthorizedException('Invalid token!');
    }
  }
}
