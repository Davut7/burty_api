import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './utils/core/allException.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { MinioModule } from './libs/minio/minio.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { PrismaModule } from './utils/prisma/prisma.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ExcludeNullInterceptor } from './common/interceptors/excludeNulls.interceptor';
import { HealthModule } from './utils/health/health.module';
import { MediaModule } from './libs/media/media.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RedisModule } from './libs/redis/redis.module';
import { AuthModule } from './components/auth/auth.module';
import { TokenModule } from './components/token/token.module';
import { UsersModule } from './components/users/users.module';
import { AuthCommonModule } from './components/common/authCommon/authCommon.module';
import { CategoryModule } from './components/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      // validate,
      isGlobal: true,
      cache: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: 'redis',
        ttl: 60,
        host: configService.getOrThrow<string>('REDIS_HOST'),
        port: configService.getOrThrow<number>('REDIS_PORT'),
        no_ready_check: true,
      }),
    }),
    TerminusModule.forRoot(),
    HealthModule,
    MediaModule,
    MinioModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    TokenModule,
    UsersModule,
    AuthCommonModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExcludeNullInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements OnModuleInit {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {}
  async onModuleInit() {}
}
