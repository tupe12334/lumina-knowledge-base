import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DegreesResolver } from './degrees.resolver';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';

describe('DegreesResolver', () => {
  let resolver: DegreesResolver;
  let mock: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    mock = {
      findAll: vi.fn(),
      findUnique: vi.fn(),
      findByUniversityId: vi.fn(),
      findByUniversityIdAndDisciplineId: vi.fn(),
    };
    resolver = new DegreesResolver(mock as unknown as DegreesService);
  });

  it('returns degrees', async () => {
    const degrees = [{ id: '1' }] as Degree[];
    mock.findAll.mockResolvedValue(degrees);
    expect(await resolver.getDegrees()).toEqual(degrees);
  });

  it('returns a degree or null', async () => {
    const degree = { id: '1' } as Degree;
    mock.findUnique.mockResolvedValue(degree);
    expect(await resolver.getDegree('1')).toEqual(degree);
    mock.findUnique.mockResolvedValue(null);
    expect(await resolver.getDegree('missing')).toBeNull();
  });

  it('returns degrees by filters', async () => {
    const degrees = [{ id: '1' }] as Degree[];
    mock.findByUniversityId.mockResolvedValue(degrees);
    expect(await resolver.getDegreesByUniversity('u1')).toEqual(degrees);
    mock.findByUniversityIdAndDisciplineId.mockResolvedValue(degrees);
    expect(
      await resolver.getDegreesByUniversityAndDiscipline('u1', 'd1'),
    ).toEqual(degrees);
  });
});
