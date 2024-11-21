import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { RedisClientOptions } from 'redis';
import { AuthGuard } from './common/guards/auth.guard';
import { ExcludeNullInterceptor } from './common/interceptors/excludeNulls.interceptor';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AuthModule } from './components/auth/auth.module';
import { BookingModule } from './components/booking/booking.module';
import { CategoryModule } from './components/category/category.module';
import { CommentsModule } from './components/comments/comments.module';
import { AuthCommonModule } from './components/common/authCommon/authCommon.module';
import { BookingCommonModule } from './components/common/bookingCommon/bookingCommon.module';
import { CategoryCommonModule } from './components/common/categoryCommon/categoryCommon.module';
import { CommentCommonModule } from './components/common/commentCommon/commentCommon.module';
import { ReviewsCommonModule } from './components/common/reviewsCommon/reviewsCommon.module';
import { SpaceCommonModule } from './components/common/spaceCommon/spaceCommon.module';
import { MentorModule } from './components/mentor/mentor.module';
import { PaymentsModule } from './components/payments/payments.module';
import { ReviewsModule } from './components/reviews/reviews.module';
import { SpacesModule } from './components/spaces/spaces.module';
import { TokenModule } from './components/token/token.module';
import { UsersModule } from './components/users/users.module';
import { MediaModule } from './libs/media/media.module';
import { MinioModule } from './libs/minio/minio.module';
import { RedisModule } from './libs/redis/redis.module';
import { TasksModule } from './libs/tasks/tasks.module';
import { AllExceptionsFilter } from './utils/core/allException.filter';
import { HealthModule } from './utils/health/health.module';
import { PrismaModule } from './utils/prisma/prisma.module';

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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get('MONGO_USERNAME');
        const password = configService.get('MONGO_PASSWORD');
        const database = configService.get('MONGO_DATABASE');
        const host = configService.get('MONGO_HOST');

        return {
          uri: `mongodb://${username}:${password}@${host}`,
          dbName: database,
        };
      },
      inject: [ConfigService],
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
    SpacesModule,
    CategoryCommonModule,
    SpaceCommonModule,
    ReviewsModule,
    BookingModule,
    MentorModule,
    CommentsModule,
    ReviewsCommonModule,
    CommentCommonModule,
    PaymentsModule,
    BookingCommonModule,
    TasksModule,
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
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
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
