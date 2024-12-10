import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from '../prisma/prisma.health';

@Injectable()
export class HealthService implements OnModuleInit {
  constructor(
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly http: HttpHealthIndicator,
    private readonly prisma: PrismaHealthIndicator,
  ) {}

  async onModuleInit() {
    await this.checkHealthOnStartup();
  }

  private async checkHealthOnStartup() {
    try {
      await this.health.check([
        // async () =>
        //   this.disk.checkStorage('disk health', {
        //     thresholdPercent: 0.9,
        //     path: '/',
        //   }),
        // async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        // async () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
        // async () => this.http.pingCheck('internet', 'https://www.google.com'),
        // async () => this.prisma.isHealthy('prisma'),
      ]);
      console.log('Health check passed successfully.');
    } catch (error) {
      console.error('Health check failed', error);
      process.exit(1);
    }
  }
}
