import { describe, it, expect, vi } from 'vitest';
import { BlocksController } from './blocks.controller';
import { BlocksService } from './blocks.service';

describe('BlocksController', () => {
  it('gets block from service', async () => {
    const service = {
      findUnique: vi.fn().mockResolvedValue({ id: 'b1' }),
    } as unknown as BlocksService;

    const controller = new BlocksController(service);
    const result = await controller.getBlock('b1');

    expect(result).toEqual({ id: 'b1' });
  });
});
