import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from 'src/system/health/health.controller';
import { DbRowsHealthIndicator } from 'src/system/health/db-rows.indicator';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [DbRowsHealthIndicator],
})
export class HealthModule {}
