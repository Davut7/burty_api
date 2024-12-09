import { Module } from '@nestjs/common';
import { MediaModule } from 'src/libs/media/media.module';
import { RedisModule } from 'src/libs/redis/redis.module';
import { UserCommonModule } from '../common/userCommon/userCommon.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [UserCommonModule, MediaModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
