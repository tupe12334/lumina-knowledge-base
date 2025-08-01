import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesResolver } from './universities.resolver';
import { UniversitiesService } from './universities.service';
import { University } from './models/University.entity';

describe('UniversitiesResolver', () => {
  let resolver: UniversitiesResolver;
  let service: UniversitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversitiesResolver,
        {
          provide: UniversitiesService,
          useValue: {
            findAll: vi.fn(),
            findUnique: vi.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UniversitiesResolver>(UniversitiesResolver);
    service = module.get<UniversitiesService>(UniversitiesService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getUniversities', () => {
    it('should return an array of universities', async () => {
      const mockUniversities: University[] = [
        {
          id: '1',
          name: { en_text: 'Test University', he_text: 'אוניברסיטת טסט' },
          courses: [],
          degrees: [],
        },
      ];

      const findAllSpy = vi
        .spyOn(service, 'findAll')
        .mockResolvedValue(mockUniversities);

      const result = await resolver.getUniversities();

      expect(result).toEqual(mockUniversities);
      expect(findAllSpy).toHaveBeenCalled();
    });
  });

  describe('getUniversity', () => {
    it('should return a university by id', async () => {
      const mockUniversity: University = {
        id: '1',
        name: { en_text: 'Test University', he_text: 'אוניברסיטת טסט' },
        courses: [],
        degrees: [],
      };

      const findUniqueSpy = vi
        .spyOn(service, 'findUnique')
        .mockResolvedValue(mockUniversity);

      const result = await resolver.getUniversity('1');

      expect(result).toEqual(mockUniversity);
      expect(findUniqueSpy).toHaveBeenCalledWith('1');
    });

    it('should return null if university not found', async () => {
      const findUniqueSpy = vi
        .spyOn(service, 'findUnique')
        .mockResolvedValue(null);

      const result = await resolver.getUniversity('non-existent');

      expect(result).toBeNull();
      expect(findUniqueSpy).toHaveBeenCalledWith('non-existent');
    });
  });
});
