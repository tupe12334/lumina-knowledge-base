import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';
import { DbRowsHealthIndicator } from 'src/system/health/db-rows.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memoryHealth: MemoryHealthIndicator,
    private diskHealth: DiskHealthIndicator,
    private prisma: PrismaService,
    private dbRows: DbRowsHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.dbRows.isHealthy('db_rows', 100),
      () => this.memoryHealth.checkHeap('memory_heap', 150 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);
  }

  @Get('liveness')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memoryHealth.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.prisma),
      () => this.dbRows.isHealthy('db_rows', 100),
      () =>
        this.diskHealth.checkStorage('storage', {
          thresholdPercent: 0.95,
          path: '/',
        }),
    ]);
  }
}
