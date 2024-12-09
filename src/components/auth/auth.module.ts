import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MailsModule } from 'src/components/mails/mails.module';
import { RedisModule } from 'src/libs/redis/redis.module';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { ConfigService } from '@nestjs/config';
import { UserCommonModule } from '../common/userCommon/userCommon.module';

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
  ],
  providers: [AuthService, ThrottlerGuard],
  controllers: [AuthController],
})
export class AuthModule {}
