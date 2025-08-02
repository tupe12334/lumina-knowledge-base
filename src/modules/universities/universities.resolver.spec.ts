import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UniversitiesResolver } from './universities.resolver';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';

describe('UniversitiesResolver', () => {
  let resolver: UniversitiesResolver;
  const mockUniversitiesService = {
    findAll: vi.fn(),
    findUnique: vi.fn(),
  };

  beforeEach(() => {
    resolver = new UniversitiesResolver(
      mockUniversitiesService as unknown as UniversitiesService,
    );
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

      mockUniversitiesService.findAll.mockResolvedValue(mockUniversities);

      const result = await resolver.getUniversities();

      expect(result).toEqual(mockUniversities);
      expect(mockUniversitiesService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUniversity', () => {
    it('should return a university by id', async () => {
      const mockUniversity = {
        id: '1',
      } as University;

      mockUniversitiesService.findUnique.mockResolvedValue(mockUniversity);

      const result = await resolver.getUniversity('1');

      expect(result).toEqual(mockUniversity);
      expect(mockUniversitiesService.findUnique).toHaveBeenCalledWith('1');
    });

    it('should return null if university not found', async () => {
      mockUniversitiesService.findUnique.mockResolvedValue(null);

      const result = await resolver.getUniversity('non-existent');

      expect(result).toBeNull();
      expect(mockUniversitiesService.findUnique).toHaveBeenCalledWith(
        'non-existent',
      );
    });
  });
});
