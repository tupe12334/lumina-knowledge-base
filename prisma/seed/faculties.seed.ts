import { Prisma } from '../../generated/client';
import { FACULTIES, faculties } from './faculties.consts.seed';
import {
  THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
  THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
} from './universities.consts';
import { SeedCache } from './cache';

const FACULTY_UNIVERSITY_IDS: Record<string, Record<string, string>> = {
  [THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME]: {
    'Social Sciences': '067fc944-3d78-4675-a759-804e22b179a9',
    'Exact Sciences': 'c65fa3bd-2f3a-40d8-b192-3be77adc7802',
    Engineering: '8f2e1d4c-5b3a-4e8f-9c7d-1a2b3c4d5e6f',
    Arts: '5ab28f7a-c455-47a8-b891-d9076c46d673',
  },
  [THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME]: {
    'Exact Sciences': '7e3f2c1b-9a8d-4f6e-8c5b-2d3e4f5a6b7c',
  },
};

export async function seedFaculties(
  prisma: Prisma.TransactionClient,
  cache: SeedCache,
) {
  for (const [universityEnText, facultyEnTexts] of Object.entries(faculties)) {
    const university = await cache.getUniversity(prisma, universityEnText);

    if (!university) {
      throw new Error(
        `University '${universityEnText}' not found. Seed universities and translations first.`,
      );
    }

    for (const facultyEnText of facultyEnTexts) {
      const facultyData = FACULTIES[facultyEnText];
      if (!facultyData) {
        throw new Error(`Data for faculty '${facultyEnText}' not found.`);
      }

      // Get the hard-coded ID for this faculty-university combination
      const facultyId =
        FACULTY_UNIVERSITY_IDS[universityEnText]?.[facultyEnText];
      if (!facultyId) {
        throw new Error(
          `No hard-coded ID found for faculty '${facultyEnText}' at university '${universityEnText}'`,
        );
      }

      const existingName = await cache.getTranslation(prisma, facultyEnText);
      const nameTranslation = existingName;
      if (!nameTranslation) {
        throw new Error(
          `Translation not found for faculty '${facultyEnText}'. Ensure translations are seeded first.`,
        );
      }

      // Use direct ID lookup instead of text matching for faculty descriptions
      const descriptionTranslation = await prisma.translation.findFirst({
        where: { id: facultyData.description.id },
      });
      if (!descriptionTranslation) {
        throw new Error(
          `Translation not found for faculty description with ID '${facultyData.description.id}'. Ensure translations are seeded first.`,
        );
      }

      await prisma.faculty.upsert({
        where: {
          translationId_universityId: {
            translationId: nameTranslation.id,
            universityId: university.id,
          },
        },
        update: {
          descriptionId: descriptionTranslation.id,
        },
        create: {
          id: facultyId,
          universityId: university.id,
          translationId: nameTranslation.id,
          descriptionId: descriptionTranslation.id,
        },
      });
      console.log(
        `Seeded faculty '${facultyEnText}' for university '${universityEnText}'.`,
      );
    }
  }
}
