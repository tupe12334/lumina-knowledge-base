import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FacultiesResolver } from './faculties.resolver';
import { FacultiesService } from './faculties.service';
import { DegreesService } from '../degrees/degrees.service';

describe('FacultiesResolver', () => {
  let resolver: FacultiesResolver;
  let mockFacultiesService: {
    getFacultiesByUniversity: ReturnType<typeof vi.fn>;
    getFacultyById: ReturnType<typeof vi.fn>;
  };
  let mockDegreesService: { findByFacultyId: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockFacultiesService = {
      getFacultiesByUniversity: vi.fn(),
      getFacultyById: vi.fn(),
    };

    mockDegreesService = {
      findByFacultyId: vi.fn(),
    };

    resolver = new FacultiesResolver(
      mockFacultiesService as unknown as FacultiesService,
      mockDegreesService as unknown as DegreesService,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('getFacultiesByUniversity should delegate to service', async () => {
    const mock = [{ id: 'f1' }];
    mockFacultiesService.getFacultiesByUniversity.mockResolvedValue(mock);
    const res = await resolver.getFacultiesByUniversity('u1');
    expect(res).toBe(mock);
    expect(mockFacultiesService.getFacultiesByUniversity).toHaveBeenCalledWith(
      'u1',
    );
  });

  it('getFaculty should delegate to service', async () => {
    const mock = { id: 'f1' };
    mockFacultiesService.getFacultyById.mockResolvedValue(mock);
    const res = await resolver.getFaculty('f1');
    expect(res).toBe(mock);
    expect(mockFacultiesService.getFacultyById).toHaveBeenCalledWith('f1');
  });

  it('degrees field should use DegreesService', async () => {
    const mockDegrees = [{ id: 'd1' }];
    mockDegreesService.findByFacultyId.mockResolvedValue(mockDegrees);
    const res = await resolver.getDegrees({
      id: 'f1',
    } as unknown as import('./models/Faculty.entity').Faculty);
    expect(res).toBe(mockDegrees);
    expect(mockDegreesService.findByFacultyId).toHaveBeenCalledWith('f1');
  });

  it('degrees field returns empty array when no id', async () => {
    const res = await resolver.getDegrees(
      {} as unknown as import('./models/Faculty.entity').Faculty,
    );
    expect(res).toEqual([]);
  });
});
