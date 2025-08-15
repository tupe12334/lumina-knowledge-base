import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { DbRowsHealthIndicator } from './db-rows.indicator';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthController],
  providers: [DbRowsHealthIndicator],
})
export class HealthModule {}
