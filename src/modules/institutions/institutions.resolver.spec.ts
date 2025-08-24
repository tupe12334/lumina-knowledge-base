import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InstitutionsResolver } from './institutions.resolver';
import { InstitutionsService } from './institutions.service';
import { Institution } from './models/Institution.entity';

describe('InstitutionsResolver', () => {
  let resolver: InstitutionsResolver;
  const mockInstitutionsService = {
    findAll: vi.fn(),
    findUnique: vi.fn(),
  };

  beforeEach(() => {
    resolver = new InstitutionsResolver(
      mockInstitutionsService as unknown as InstitutionsService,
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
      ] as Institution[];

      mockInstitutionsService.findAll.mockResolvedValue(mockUniversities);

      const result = await resolver.getUniversities();

      expect(result).toEqual(mockUniversities);
      expect(mockInstitutionsService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUniversity', () => {
    it('should return a university by id', async () => {
      const mockUniversity = {
        id: '1',
      } as Institution;

      mockInstitutionsService.findUnique.mockResolvedValue(mockUniversity);

      const result = await resolver.getUniversity('1');

      expect(result).toEqual(mockUniversity);
      expect(mockInstitutionsService.findUnique).toHaveBeenCalledWith('1');
    });

    it('should return null if university not found', async () => {
      mockInstitutionsService.findUnique.mockResolvedValue(null);

      const result = await resolver.getUniversity('non-existent');

      expect(result).toBeNull();
      expect(mockInstitutionsService.findUnique).toHaveBeenCalledWith(
        'non-existent',
      );
    });
  });
});
