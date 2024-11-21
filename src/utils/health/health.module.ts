import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TerminusLogger } from './terminus.logger';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: TerminusLogger,
      errorLogStyle: 'pretty',
      gracefulShutdownTimeoutMs: 1000,
    }),
    HttpModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
