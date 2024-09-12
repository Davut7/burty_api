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
    this.logger.log(`Setting token ${token} with expiry for key: ${key}`);
    await this.redisRepository.setWithExpiry(
      'accessToken',
      key,
      token,
      +this.tenMinutesInSeconds,
    );
    this.logger.log(`Token ${token} set with expiry for key: ${key}`);
  }

  async getRedisToken(token: string) {
    this.logger.log(`Getting token from Redis: ${token}`);
    const retrievedToken = await this.redisRepository.get('accessToken', token);
    this.logger.log(`Token ${token} retrieved from Redis`);
    return retrievedToken;
  }

  async setEmailVerificationLinkWithExpiry(
    key: string,
    link: string,
  ): Promise<void> {
    this.logger.log(
      `Устанавливаем ссылку ${link} с истечением срока для ключа: ${key}`,
    );
    await this.redisRepository.setWithExpiry(
      'verificationLink',
      key,
      link,
      +this.tenMinutesInSeconds,
    );
    this.logger.log(
      `Ссылка ${link} установлена с истечением срока для ключа: ${key}`,
    );
  }

  async getEmailVerificationLink(key: string) {
    this.logger.log(`Получаем ссылку из Redis для ключа: ${key}`);
    const retrievedLink = await this.redisRepository.get(
      'verificationLink',
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

  async deleteEmailVerificationLink(key: string) {
    this.logger.log(`Удаляем ссылку из Redis для ключа: ${key}`);
    await this.redisRepository.delete('verificationLink', key);

    this.logger.warn(`Ссылка для ключа: ${key} удален`);
    return true;
  }

  async setResetPasswordLinkWithExpiry(
    key: string,
    link: string,
  ): Promise<void> {
    this.logger.log(
      `Устанавливаем ссылка для сброса ${link} с истечением срока для ключа: ${key}`,
    );
    await this.redisRepository.setWithExpiry(
      'resetPasswordLink',
      key,
      link,
      +this.tenMinutesInSeconds,
    );
    this.logger.log(
      `Ссылка ${link} установлена с истечением срока для ключа: ${key}`,
    );
  }

  async getResetPasswordVerificationLink(key: string) {
    this.logger.log(`Получаем ссылку из Redis для ключа: ${key}`);
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

  async setPhoneNumberVerificationWithExpiry(
    key: string,
    code: string,
  ): Promise<void> {
    this.logger.log(
      `Устанавливаем код для верификация номера ${code} с истечением срока для ключа: ${key}`,
    );
    await this.redisRepository.setWithExpiry(
      'phoneNumberVerification',
      key,
      code,
      +this.tenMinutesInSeconds,
    );
    this.logger.log(
      `Код ${code} установлена с истечением срока для ключа: ${key}`,
    );
  }

  async getPhoneNumberVerificationCode(key: string) {
    this.logger.log(`Получаем код из Redis для ключа: ${key}`);
    const retrievedCode = await this.redisRepository.get(
      'phoneNumberVerification',
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

  async deletePhoneNumberVerificationCode(code: string) {
    this.logger.log(`Удаляем код из Redis для ключа: ${code}`);
    await this.redisRepository.delete('phoneNumberVerification', code);

    this.logger.warn(`Ссылка для ключа: ${code} удален`);
    return true;
  }
}
