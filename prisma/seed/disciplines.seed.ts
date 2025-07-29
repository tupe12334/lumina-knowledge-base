import { Prisma } from '../../generated/client';
import { SeedCache } from './cache';

export async function seedDisciplines(
  prisma: Prisma.TransactionClient,
  cache: SeedCache,
) {
  // Faculty names and their disciplines
  const facultiesWithDisciplines: Record<string, string[]> = {
    'Social Sciences': ['Economics', 'Psychology'],
    'Exact Sciences': [
      'Cognitive Science',
      'Mathematics',
      'Computer Science',
      'Physics',
      'Chemistry',
      'Biology',
    ],
  };

  for (const [facultyEnText, disciplineEnTexts] of Object.entries(
    facultiesWithDisciplines,
  )) {
    // Find faculty by translation
    const facultyTranslation = await cache.getTranslation(prisma, facultyEnText);
    if (!facultyTranslation) {
      throw new Error(
        `Translation for faculty '${facultyEnText}' not found. Seed translations first.`,
      );
    }
    const faculty = await prisma.faculty.findFirst({
      where: { translationId: facultyTranslation.id },
    });
    if (!faculty) {
      throw new Error(
        `Faculty '${facultyEnText}' not found. Seed faculties first.`,
      );
    }

    for (const disciplineEnText of disciplineEnTexts) {
      // Find translation for discipline
      const disciplineTranslation = await cache.getTranslation(
        prisma,
        disciplineEnText,
      );
      if (!disciplineTranslation) {
        throw new Error(
          `Translation for discipline '${disciplineEnText}' not found. Seed translations first.`,
        );
      }
      // Check if discipline already exists
      const existingDiscipline = await prisma.discipline.findFirst({
        where: { id: disciplineIdMap[disciplineEnText] },
      });
      if (!existingDiscipline) {
        await prisma.discipline.create({
          data: {
            id: disciplineIdMap[disciplineEnText],
            translationId: disciplineTranslation.id,
            facultyId: faculty.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        console.log(
          `Seeded discipline '${disciplineEnText}' for faculty '${facultyEnText}'.`,
        );
      } else {
        console.log(
          `Discipline '${disciplineEnText}' for faculty '${facultyEnText}' already exists.`,
        );
      }
    }
  }
}

export const disciplineIdMap: Record<string, string> = {
  Economics: 'e4a21e48-000e-4148-a6e1-d2b07ccd29ac',
  Psychology: '52ee2159-4600-4aed-91f3-5b8c0f2006f9',
  'Cognitive Science': 'b19d4e12-a72a-46a6-8ae9-41816358e368',
  Mathematics: '389f390a-1015-4186-9681-aada955b767e',
  'Computer Science': '9d3b0adb-f17c-45bc-bd13-bd88964a8f63',
  Physics: 'ca07e4db-7524-449c-8739-9cfba28dbf22',
  Chemistry: 'c1e36cb5-d073-4ed2-8092-09424e7c47d2',
  Biology: '81bed8eb-fe4f-47a3-9a92-0987e021b645',
};
