import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import axios from 'axios';
import { FacebookLoginResponse } from './response/facebookLogin.response';
import { AuthCommonService } from 'src/components/common/authCommon/authCommon.service';
import { UserSocialRegistrationDto } from 'src/components/auth/dto/userSocialRegistration.dto';

@Injectable()
export class FacebookAuthService {
  private readonly logger = new Logger(FacebookAuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly authCommonService: AuthCommonService,
  ) {}

  getAuthUrl() {
    const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const redirectUri = this.configService.get<string>('FACEBOOK_REDIRECT_URI');
    const scope = 'email';
    return `https://www.facebook.com/v9.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  }

  async facebookLogin(code: string): Promise<FacebookLoginResponse> {
    try {
      const clientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
      const clientSecret = this.configService.get<string>(
        'FACEBOOK_CLIENT_SECRET',
      );
      const redirectUri = this.configService.get<string>(
        'FACEBOOK_REDIRECT_URI',
      );

      const tokenResponse = await axios.get(
        `https://graph.facebook.com/v9.0/oauth/access_token`,
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code,
          },
        },
      );

      const accessToken = tokenResponse.data.access_token;

      const userResponse = await axios.get(`https://graph.facebook.com/me`, {
        params: {
          access_token: accessToken,
          fields: 'id,name,email,picture',
        },
      });

      const user = userResponse.data;

      if (!user) {
        this.logger.error('Не удалось получить пользователя от Facebook!');
        throw new BadRequestException(
          'Не удалось получить пользователя от Facebook',
        );
      }

      this.logger.log(`Получен пользователь от Facebook: ${user.email}`);

      const userRegistrationDto: UserSocialRegistrationDto = {
        userName: user.given_name || user.name,
        email: user.email,
        provider: 'facebook',
      };

      return await this.authCommonService.loginOrRegistration(
        userRegistrationDto,
      );
    } catch (error: any) {
      this.logger.error('Ошибка входа через Facebook:', error.message);
      throw new BadRequestException('Ошибка авторизации через Facebook');
    }
  }
}
