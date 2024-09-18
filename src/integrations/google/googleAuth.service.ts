import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { UserSocialRegistrationDto } from 'src/components/auth/dto/userSocialRegistration.dto';
import { AuthCommonService } from 'src/components/common/authCommon/authCommon.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';

@Injectable()
export class GoogleAuthService {
  logger = new Logger(GoogleAuthService.name);
  private oauth2Client;
  scopes = ['https://www.googleapis.com/auth/userinfo.profile'];

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private authCommonService: AuthCommonService,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );
  }

  getAuthUrl() {
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
      include_granted_scopes: true,
    });
    return url;
  }

  async googleLogin(code: string) {
    this.logger.log('Попытка входа с помощью Google...');

    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2',
      });

      const userInfo = await oauth2.userinfo.get();
      const user = userInfo.data;

      if (!user) {
        this.logger.error('Не удалось получить пользователя от Google!');
        throw new BadRequestException(
          'Не удалось получить пользователя от Google',
        );
      }

      this.logger.log(`Получен пользователь от Google: ${user.email}`);

      let userFromDb = await this.prismaService.users.findUnique({
        where: { email: user.email },
      });

      const userRegistrationDto: UserSocialRegistrationDto = {
        userName: user.given_name || user.name,
        email: user.email,
        provider: 'google',
      };

      return await this.authCommonService.loginOrRegistration(
        userRegistrationDto,
      );
    } catch (error: any) {
      this.logger.error('Ошибка входа через Google:', error.message);
      throw new BadRequestException('Ошибка авторизации через Google');
    }
  }
}
