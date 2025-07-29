import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from './prisma.service';

vi.mock('../../generated/client', () => {
  class PrismaClientMock {
    async $connect(): Promise<void> {
      return Promise.resolve();
    }
    async $disconnect(): Promise<void> {
      return Promise.resolve();
    }
  }
  return { PrismaClient: PrismaClientMock };
});

describe('PrismaService', () => {
  it('should be defined', async () => {
    const module = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    const service = module.get(PrismaService);
    expect(service).toBeDefined();
  });
});
