import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { DbRowsHealthIndicator } from 'src/system/health/db-rows.indicator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    @Inject(HealthCheckService)
    private readonly health: HealthCheckService,
    @Inject(PrismaHealthIndicator)
    private readonly prismaHealth: PrismaHealthIndicator,
    @Inject(MemoryHealthIndicator)
    private readonly memoryHealth: MemoryHealthIndicator,
    @Inject(DiskHealthIndicator)
    private readonly diskHealth: DiskHealthIndicator,
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
    @Inject(DbRowsHealthIndicator)
    private readonly dbRows: DbRowsHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOkResponse({ description: 'Health check status' })
  @ApiInternalServerErrorResponse({ description: 'Health check failed' })
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
  @ApiOkResponse({ description: 'Liveness check status' })
  @ApiInternalServerErrorResponse({ description: 'Liveness check failed' })
  liveness() {
    return this.health.check([
      () => this.memoryHealth.checkHeap('memory_heap', 300 * 1024 * 1024),
      () => this.memoryHealth.checkRSS('memory_rss', 300 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOkResponse({ description: 'Readiness check status' })
  @ApiInternalServerErrorResponse({ description: 'Readiness check failed' })
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
