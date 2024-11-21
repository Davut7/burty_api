import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
    HealthCheck,
    HealthCheckService,
    HttpHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckAuthGuard } from 'src/common/guards/healthCheck.guard';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
    ) {}

    @ApiExcludeEndpoint()
    @Get()
    @UseGuards(HealthCheckAuthGuard)
    @HealthCheck()
    check() {
        return this.health.check([
            async () =>
                this.http.pingCheck('internet', 'https://www.google.com'),
        ]);
    }
}
