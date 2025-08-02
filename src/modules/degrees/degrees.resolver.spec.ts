import { Test, TestingModule } from '@nestjs/testing';
import { DegreesResolver } from './degrees.resolver';
import { DegreesService } from './degrees.service';
import { DegreesQueryDto } from './dto/degrees-query.dto';
import { vi } from 'vitest';

describe('DegreesResolver', () => {
  let resolver: DegreesResolver;
  let service: DegreesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DegreesResolver,
        { provide: DegreesService, useValue: { findAll: vi.fn() } },
      ],
    }).compile();

    resolver = module.get<DegreesResolver>(DegreesResolver);
    service = module.get<DegreesService>(DegreesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('degrees', () => {
    it('should call the service findAll method with the correct query', async () => {
      const query: DegreesQueryDto = { name: 'test' };
      await resolver.degrees(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });
});
