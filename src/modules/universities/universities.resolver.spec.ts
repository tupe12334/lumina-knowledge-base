import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesResolver } from './universities.resolver';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';

describe('UniversitiesResolver', () => {
  let resolver: UniversitiesResolver;
  let mockService: {
    findAll: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    mockService = {
      findAll: vi.fn(),
      findUnique: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversitiesResolver,
        {
          provide: UniversitiesService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<UniversitiesResolver>(UniversitiesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUniversities', () => {
    it('should return an array of universities', async () => {
      const mockUniversities = [
        {
          id: '1',
        },
      ] as University[];

      mockService.findAll.mockResolvedValue(mockUniversities);

      const result = await resolver.getUniversities();

      expect(result).toEqual(mockUniversities);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUniversity', () => {
    it('should return a university by id', async () => {
      const mockUniversity = {
        id: '1',
      } as University;

      mockService.findUnique.mockResolvedValue(mockUniversity);

      const result = await resolver.getUniversity('1');

      expect(result).toEqual(mockUniversity);
      expect(mockService.findUnique).toHaveBeenCalledWith('1');
    });

    it('should return null if university not found', async () => {
      mockService.findUnique.mockResolvedValue(null);

      const result = await resolver.getUniversity('non-existent');

      expect(result).toBeNull();
      expect(mockService.findUnique).toHaveBeenCalledWith('non-existent');
    });
  });
});
