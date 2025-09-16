import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { env } from '../env';
import { validateAndFixAllDatabaseUUIDs } from '../utils/uuid-validator-type-safe';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger: Logger;

  constructor() {
    super();
    this.logger = new Logger(PrismaService.name);
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.$executeRaw`PRAGMA foreign_keys = ON;`;

    // Validate and fix UUIDs in the database on startup
    if (!env.BLOCK_MUTATIONS) {
      this.logger.log('Starting database UUID validation (BLOCK_MUTATIONS=false)...');
      try {
        const results = await validateAndFixAllDatabaseUUIDs(this, true);

        if (results.length > 0) {
          this.logger.log('UUID validation results:');
          results.forEach(result => {
            if (result.errors.length === 0) {
              this.logger.log(`  ${result.tableName}: Fixed ${result.fixedCount}/${result.invalidCount} invalid UUIDs`);
            } else {
              this.logger.warn(`  ${result.tableName}: Fixed ${result.fixedCount}/${result.invalidCount} invalid UUIDs (${result.errors.length} errors)`);
            }
          });
        }
      } catch (error) {
        this.logger.error('Failed to validate database UUIDs:', error);
      }
    } else {
      this.logger.log('Checking database UUIDs (BLOCK_MUTATIONS=true)...');
      try {
        const results = await validateAndFixAllDatabaseUUIDs(this, false);

        if (results.length > 0) {
          this.logger.warn('Invalid UUIDs found in database (not fixed due to BLOCK_MUTATIONS=true):');
          results.forEach(result => {
            this.logger.warn(`  ${result.tableName}: ${result.invalidCount} invalid UUIDs`);
          });
        }
      } catch (error) {
        this.logger.error('Failed to check database UUIDs:', error);
      }
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
