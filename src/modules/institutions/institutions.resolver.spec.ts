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
      mockInstitutionsService satisfies Partial<InstitutionsService>,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUniversities', () => {
    it('should return an array of institutions', async () => {
      const mockInstitutions = [
        {
          id: '1',
        },
      ] satisfies Institution[];

      mockInstitutionsService.findAll.mockResolvedValue(mockInstitutions);

      const result = await resolver.getUniversities();

      expect(result).toEqual(mockInstitutions);
      expect(mockInstitutionsService.findAll).toHaveBeenCalled();
    });
  });

  describe('getUniversity', () => {
    it('should return an institution by id', async () => {
      const mockInstitution = {
        id: '1',
      } satisfies Institution;

      mockInstitutionsService.findUnique.mockResolvedValue(mockInstitution);

      const result = await resolver.getUniversity('1');

      expect(result).toEqual(mockInstitution);
      expect(mockInstitutionsService.findUnique).toHaveBeenCalledWith('1');
    });

    it('should return null if institution not found', async () => {
      mockInstitutionsService.findUnique.mockResolvedValue(null);

      const result = await resolver.getUniversity('non-existent');

      expect(result).toBeNull();
      expect(mockInstitutionsService.findUnique).toHaveBeenCalledWith(
        'non-existent',
      );
    });
  });
});
