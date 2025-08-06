import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.$executeRaw`PRAGMA foreign_keys = ON;`;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
