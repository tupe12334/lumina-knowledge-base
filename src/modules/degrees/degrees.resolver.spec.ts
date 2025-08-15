import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesResolver } from './degrees.resolver';
import { DegreesService } from './degrees.service';
import { DegreesQueryDto } from './dto/degrees-query.dto';

describe('DegreesResolver', () => {
  let resolver: DegreesResolver;
  const mockDegreesService = {
    findAll: vi.fn(),
    setFacultyForDegree: vi.fn(),
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

  describe('setDegreeFaculty', () => {
    it('should call the service with provided IDs', async () => {
      const updated = { id: 'deg1' } as unknown as Record<string, unknown>;
      mockDegreesService.setFacultyForDegree.mockResolvedValue(updated);
      const result = await resolver.setDegreeFaculty({
        degreeId: 'deg1',
        facultyId: 'fac1',
      } as unknown as import('./dto/set-degree-faculty.input').SetDegreeFacultyInput);
      expect(mockDegreesService.setFacultyForDegree).toHaveBeenCalledWith(
        'deg1',
        'fac1',
      );
      expect(result).toBe(updated);
    });

    it('should clear faculty when facultyId is null', async () => {
      const updated = { id: 'deg1' } as unknown as Record<string, unknown>;
      mockDegreesService.setFacultyForDegree.mockResolvedValue(updated);
      await resolver.setDegreeFaculty({
        degreeId: 'deg1',
        facultyId: null,
      } as unknown as import('./dto/set-degree-faculty.input').SetDegreeFacultyInput);
      expect(mockDegreesService.setFacultyForDegree).toHaveBeenCalledWith(
        'deg1',
        null,
      );
    });
  });
});
