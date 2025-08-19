import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createHash } from 'crypto';
import { stableStringify } from 'src/system/data-hash/stable-stringify';

export interface PrismaQueryable {
  $queryRaw<T = unknown>(...args: any[]): Promise<T>;
  $queryRawUnsafe<T = unknown>(query: string, ...params: any[]): Promise<T>;
}

@Injectable()
export class DataHashService implements OnApplicationBootstrap {
  private static readonly logger = new Logger(DataHashService.name);
  private hash: string | null = null;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaQueryable,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      this.hash = await this.computeDatabaseHash();
      DataHashService.logger.log(`Database data hash: ${this.hash}`);
    } catch (err) {
      DataHashService.logger.error(
        'Failed computing database hash',
        err as Error,
      );
    }
  }

  getHash(): string | null {
    return this.hash;
  }

  // Public wrapper to allow deterministic testing
  async computeDatabaseHashPublic(): Promise<string> {
    return this.computeDatabaseHash();
  }

  private async listModelTables(): Promise<string[]> {
    const rows = await this.prisma.$queryRaw<{ name: string }[]>`
      SELECT name FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
        AND name NOT LIKE '_%'
      ORDER BY name ASC;
    `;
    return rows.map((r) => r.name);
  }

  private async computeDatabaseHash(): Promise<string> {
    const tables = await this.listModelTables();
    const hash = createHash('sha256');

    for (const table of tables) {
      const records = await this.prisma.$queryRawUnsafe<unknown[]>(
        `SELECT * FROM "${table}" ORDER BY id ASC`,
      );
      hash.update(table);
      hash.update(stableStringify(records));
    }

    return hash.digest('hex');
  }
}
