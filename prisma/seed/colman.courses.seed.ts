import { Prisma } from 'generated/client';
import { THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME } from './universities.consts';
import { SeedCache } from './cache';

export const seedColmanCourses = async (
  prisma: Prisma.TransactionClient,
  cache: SeedCache,
) => {
  const colmanMathCourses = [
    {
      en_text: 'Linear Algebra 1',
      he_text: 'אלגברה לינארית 1',
      id: '15ec6466-6b06-49d0-b544-faba02ad791e',
      blockId: '54b62c76-29ca-49e9-a35b-734ef27a45db',
      translationId: 'f68673cc-47e6-44e8-8c18-70b9cb66fb0c',
    },
    {
      en_text: 'Linear Algebra 2',
      he_text: 'אלגברה לינארית 2',
      id: '17e9c6f3-e013-49c6-a83c-53662af927fb',
      blockId: 'c651ed04-7a51-4a9e-a770-e3457c69f60e',
      translationId: 'e4210bb1-3485-42f1-913f-1971719ccf5a',
    },
    {
      en_text: 'Infinitesimal Calculus 1',
      he_text: 'חשבון אינפיניטסימלי 1',
      id: 'dcff9c44-0c67-40ea-af5a-b837efbaf297',
      blockId: 'c331fa88-e9f3-4341-9b8a-4fe05b428f1f',
      translationId: '19c05a10-1fea-4886-bca5-1e2620b6d2fe',
    },
    {
      en_text: 'Infinitesimal Calculus 2',
      he_text: 'חשבון אינפיניטסימלי 2',
      id: '08958745-cffa-43a9-b02a-d8cdcbb26de3',
      blockId: '9c26aa0e-9b49-405e-b1c4-090ce2d16d29',
      translationId: '3ea42901-eb41-485e-a4d9-2f3727abd9ae',
    },
    {
      en_text: 'Calculus B',
      he_text: 'חדו״א ב',
      id: '3B714857-64FC-45B4-872F-079CAF47718A',
      blockId: 'EDE16E3C-66B1-4240-86B0-67B2A8B92973',
      translationId: 'C44DBE0A-CFF5-4259-9064-163E3ED72F32',
    },
    {
      en_text: 'Topics in Applied Mathematics',
      he_text: 'נושאים במטמתיקה שימושית',
      id: '9f8e7d6c-5b4a-3928-8c7b-6a5d4f3e2c1b',
      blockId: '4b3a2c1d-8e7f-4a6d-9c5b-3a4b5c6d7e8f',
      translationId: '3c4d5f6a-8b9c-4d0e-af2b-3c4d5f6a8b9c',
    },
  ];

  const colmanCsCourses = [
    {
      en_text: 'Introduction to Computer Science and Java',
      he_text: 'מבוא למדעי המחשב ושפת Java',
      id: 'c5147e60-4ad0-40cb-a93a-6de6983b3c7c',
      blockId: 'baed1685-70b6-4316-8598-693ddb29836a',
      translationId: '616e941f-78c3-4b87-bfcd-76e07c8cc112',
    },
    {
      en_text: 'Data Structures and Introduction to Algorithms',
      he_text: 'מבני נתונים ומבוא לאלגוריתמים',
      id: '97fca4ad-7d96-404b-bb98-a037123a46c1',
      blockId: 'e4a74368-8567-4f01-9907-d51434ffcbfd',
      translationId: '05f9027d-2d45-4d55-b26d-817bcfbdb99d',
    },
    {
      en_text: 'Algorithms',
      he_text: 'אלגוריתמים',
      id: 'c9448b5a-5a7c-451f-9895-430ec91af65d',
      blockId: '1052c11f-8fea-4d91-b180-297632d36c46',
      translationId: 'cf4d1bb5-63c2-4949-b3a4-dbb5cc6ba639',
    },
    {
      en_text: 'Computational Models',
      he_text: 'מודלים חישוביים',
      id: '961fb771-a9ce-4ed1-855e-caa87ca347f9',
      blockId: '4389ad4c-3cf3-4e06-b4d3-20f6b43a723b',
      translationId: 'f86dc674-1cec-424d-8d73-5344ccaeae0e',
    },
  ];

  // Find Colman university
  const colmanTranslation = await cache.getTranslation(
    prisma,
    THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
  );
  if (!colmanTranslation) {
    throw new Error('Colman university translation not found.');
  }
  const colmanUniversity = await prisma.university.findFirst({
    where: { translationId: colmanTranslation!.id },
  });
  if (!colmanUniversity) {
    throw new Error('Colman university not found.');
  }

  // Note: Translations are now handled by bulk seedTranslations()
  // This only creates courses (translations must exist already)
  const allCourses = [...colmanMathCourses, ...colmanCsCourses];
  for (const course of allCourses) {
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: course.id,
      },
    });
    if (!existingCourse) {
      // Look up the translation using the cache
      const translation = await cache.getTranslation(prisma, course.en_text);
      if (!translation) {
        throw new Error(
          `Translation not found for course: ${course.en_text}. Make sure it's added to translations.consts.ts`,
        );
      }

      await prisma.block.upsert({
        where: { id: course.blockId },
        update: {},
        create: { id: course.blockId },
      });
      await prisma.course.create({
        data: {
          id: course.id,
          translationId: translation.id,
          universityId: colmanUniversity.id,
          blockId: course.blockId,
        },
      });
    }
  }
  console.log('Colman courses seeded successfully.');
};
