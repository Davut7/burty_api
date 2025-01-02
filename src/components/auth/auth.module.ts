import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ImageTransformer } from 'src/common/pipes/imageTransform.pipe';
import { MailsModule } from 'src/components/mails/mails.module';
import { MediaModule } from 'src/libs/media/media.module';
import { RedisModule } from 'src/libs/redis/redis.module';
import { UserCommonModule } from '../common/userCommon/userCommon.module';
import { TokenModule } from '../token/token.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserCommonModule,
    TokenModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        throttlers:
          process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test'
            ? []
            : [{ limit: 5, ttl: seconds(60 * 10) }],
        storage: new ThrottlerStorageRedisService(
          `redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
        ),
      }),
    }),
    MailsModule,
    RedisModule,
    MediaModule,
  ],
  providers: [AuthService, ThrottlerGuard, ImageTransformer],
  controllers: [AuthController],
})
export class AuthModule {}
