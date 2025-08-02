import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesResolver } from './degrees.resolver';
import { DegreesService } from './degrees.service';
import { DegreesQueryDto } from './dto/degrees-query.dto';

describe('DegreesResolver', () => {
  let resolver: DegreesResolver;
  const mockDegreesService = {
    findAll: vi.fn(),
  };

  beforeEach(() => {
    resolver = new DegreesResolver(
      mockDegreesService as unknown as DegreesService,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getDegrees', () => {
    it('should call the service findAll method with the correct query', async () => {
      const query: DegreesQueryDto = { name: 'test' };
      await resolver.getDegrees(query);
      expect(mockDegreesService.findAll).toHaveBeenCalledWith(query);
    });
  });
});
