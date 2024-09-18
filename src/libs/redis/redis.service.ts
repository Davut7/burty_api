import { Injectable, Logger } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    private readonly redisRepository: RedisRepository,
    private configService: ConfigService,
  ) {}

  tenMinutesInSeconds = this.configService.get('REDIS_ACCESS_TOKEN_TIME');

  async setTokenWithExpiry(key: string, token: string): Promise<void> {
    await this.redisRepository.setWithExpiry(
      'accessToken',
      key,
      token,
      +this.tenMinutesInSeconds,
    );
  }

  async getRedisToken(token: string) {
    return await this.redisRepository.get('accessToken', token);
  }

  async setResetPasswordLinkWithExpiry(
    key: string,
    link: string,
  ): Promise<void> {
    await this.redisRepository.setWithExpiry(
      'resetPasswordLink',
      key,
      link,
      +this.tenMinutesInSeconds,
    );
  }

  async getResetPasswordVerificationLink(key: string) {
    const retrievedLink = await this.redisRepository.get(
      'resetPasswordLink',
      key,
    );
    if (retrievedLink) {
      this.logger.log(
        `Ссылка для ключа: ${key} получена из Redis: ${retrievedLink}`,
      );
    } else {
      this.logger.warn(`Ссылка для ключа: ${key} не найдена в Redis`);
    }
    return retrievedLink;
  }

  async deleteResetPasswordVerificationLink(key: string) {
    this.logger.log(`Удаляем ссылку из Redis для ключа: ${key}`);
    await this.redisRepository.delete('resetPasswordLink', key);

    this.logger.warn(`Ссылка для ключа: ${key} удален`);
    return true;
  }

  async setEmailVerificationWithExpiry(
    key: string,
    code: string,
  ): Promise<void> {
    this.logger.log(
      `Устанавливаем код для верификация почты ${code} с истечением срока для ключа: ${key}`,
    );
    await this.redisRepository.setWithExpiry(
      'emailVerification',
      key,
      code,
      +this.tenMinutesInSeconds,
    );
    this.logger.log(
      `Код ${code} установлена с истечением срока для ключа: ${key}`,
    );
  }

  async getEmailVerificationCode(key: string) {
    this.logger.log(`Получаем код из Redis для ключа: ${key}`);
    const retrievedCode = await this.redisRepository.get(
      'emailVerification',
      key,
    );
    if (retrievedCode) {
      this.logger.log(
        `Кол для ключа: ${key} получена из Redis: ${retrievedCode}`,
      );
    } else {
      this.logger.warn(`Код для ключа: ${key} не найдена в Redis`);
    }
    return retrievedCode;
  }

  async deleteEmailVerificationCode(code: string) {
    this.logger.log(`Удаляем код из Redis для ключа: ${code}`);
    await this.redisRepository.delete('emailVerification', code);

    this.logger.warn(`Ссылка для ключа: ${code} удален`);
    return true;
  }
}
