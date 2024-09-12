import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCommonModule } from '../userCommon/userCommon.module';
import { RedisModule } from 'src/libs/redis/redis.module';
import { MediaModule } from 'src/libs/media/media.module';

@Module({
  imports: [UserCommonModule, MediaModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
