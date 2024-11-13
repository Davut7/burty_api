import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
    providers: [LoggerService, ConfigService],
    exports: [LoggerService],
})
export class LoggerModule {}
