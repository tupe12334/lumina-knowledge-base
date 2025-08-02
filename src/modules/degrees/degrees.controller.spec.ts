import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesController } from './degrees.controller';
import { DegreesService } from './degrees.service';

const mockDegreesService = {
  findAll: vi.fn(),
  findUnique: vi.fn(),
  findByUniversityId: vi.fn(),
};
const mockDegree = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  createdAt: new Date(),
  updatedAt: new Date(),
  universityId: '123e4567-e89b-12d3-a456-426614174001',
  name: {
    id: 'trans-1',
    en_text: 'Computer Science',
    he_text: 'מדעי המחשב',
  },
  university: {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: {
      id: 'trans-2',
      en_text: 'University of Technology',
      he_text: 'האוניברסיטה הטכנולוגית',
    },
  },
  courses: [],
};

describe('DegreesController', () => {
  let controller: DegreesController;

  beforeEach(() => {
    controller = new DegreesController(
      mockDegreesService as unknown as DegreesService,
    );
    vi.clearAllMocks();
  });

  describe('getDegrees', () => {
    it('should return an array of degrees', async () => {
      const expectedDegrees = [mockDegree];
      mockDegreesService.findAll.mockResolvedValue(expectedDegrees);

      const result = await controller.getDegrees();

      expect(result).toEqual(expectedDegrees);
      expect(mockDegreesService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDegree', () => {
    const degreeId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a degree when found', async () => {
      mockDegreesService.findUnique.mockResolvedValue(mockDegree);

      const result = await controller.getDegree(degreeId);

      expect(result).toEqual(mockDegree);
      expect(mockDegreesService.findUnique).toHaveBeenCalledWith(degreeId);
    });

    it('should return null when degree not found', async () => {
      mockDegreesService.findUnique.mockResolvedValue(null);

      const result = await controller.getDegree(degreeId);

      expect(result).toBeNull();
      expect(mockDegreesService.findUnique).toHaveBeenCalledWith(degreeId);
    });
  });

  describe('getDegreesByUniversity', () => {
    const universityId = '123e4567-e89b-12d3-a456-426614174001';

    it('should return degrees for a specific university', async () => {
      const expectedDegrees = [mockDegree];
      mockDegreesService.findByUniversityId.mockResolvedValue(expectedDegrees);

      const result = await controller.getDegreesByUniversity(universityId);

      expect(result).toEqual(expectedDegrees);
      expect(mockDegreesService.findByUniversityId).toHaveBeenCalledWith(
        universityId,
      );
    });

    it('should return empty array when no degrees found for university', async () => {
      mockDegreesService.findByUniversityId.mockResolvedValue([]);

      const result = await controller.getDegreesByUniversity(universityId);

      expect(result).toEqual([]);
      expect(mockDegreesService.findByUniversityId).toHaveBeenCalledWith(
        universityId,
      );
    });
  });
});
