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
    },
    {
      en_text: 'Linear Algebra 2',
      he_text: 'אלגברה לינארית 2',
      id: '17e9c6f3-e013-49c6-a83c-53662af927fb',
      blockId: 'c651ed04-7a51-4a9e-a770-e3457c69f60e',
    },
    {
      en_text: 'Infinitesimal Calculus 1',
      he_text: 'חשבון אינפיניטסימלי 1',
      id: 'dcff9c44-0c67-40ea-af5a-b837efbaf297',
      blockId: 'c331fa88-e9f3-4341-9b8a-4fe05b428f1f',
    },
    {
      en_text: 'Infinitesimal Calculus 2',
      he_text: 'חשבון אינפיניטסימלי 2',
      id: '08958745-cffa-43a9-b02a-d8cdcbb26de3',
      blockId: '9c26aa0e-9b49-405e-b1c4-090ce2d16d29',
    },
  ];

  const colmanCsCourses = [
    {
      en_text: 'Introduction to Computer Science and Java',
      he_text: 'מבוא למדעי המחשב ושפת Java',
      id: 'c5147e60-4ad0-40cb-a93a-6de6983b3c7c',
      blockId: 'baed1685-70b6-4316-8598-693ddb29836a',
    },
    {
      en_text: 'Data Structures and Introduction to Algorithms',
      he_text: 'מבני נתונים ומבוא לאלגוריתמים',
      id: '97fca4ad-7d96-404b-bb98-a037123a46c1',
      blockId: 'e4a74368-8567-4f01-9907-d51434ffcbfd',
    },
    {
      en_text: 'Algorithms',
      he_text: 'אלגוריתמים',
      id: 'c9448b5a-5a7c-451f-9895-430ec91af65d',
      blockId: '1052c11f-8fea-4d91-b180-297632d36c46',
    },
    {
      en_text: 'Computational Models',
      he_text: 'מודלים חישוביים',
      id: '961fb771-a9ce-4ed1-855e-caa87ca347f9',
      blockId: '4389ad4c-3cf3-4e06-b4d3-20f6b43a723b',
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
  const colmanUniversity = await cache.getUniversity(
    prisma,
    THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
  );
  if (!colmanUniversity) {
    throw new Error('Colman university not found.');
  }

  // Use Mathematics discipline for all courses
  const mathTranslation = await cache.getTranslation(prisma, 'Mathematics');
  if (!mathTranslation) {
    throw new Error('Mathematics translation not found.');
  }
  const mathDiscipline = await prisma.discipline.findFirst({
    where: { translationId: mathTranslation.id },
  });
  if (!mathDiscipline) {
    throw new Error('Mathematics discipline not found.');
  }

  for (const course of colmanMathCourses) {
    // Ensure translation exists
    let translation = await cache.getTranslation(prisma, course.en_text);
    if (!translation) {
      translation = await prisma.translation.create({
        data: {
          id: course.id,
          en_text: course.en_text,
          he_text: course.he_text,
        },
      });
    }

    // Ensure course exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        translationId: translation.id,
        universityId: colmanUniversity.id,
        disciplineId: mathDiscipline.id,
      },
    });
    if (!existingCourse) {
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
          disciplineId: mathDiscipline.id,
          blockId: course.blockId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  // Use Computer Science discipline for all courses
  const csTranslation = await cache.getTranslation(prisma, 'Computer Science');
  if (!csTranslation) {
    throw new Error('Computer Science translation not found.');
  }
  const csDiscipline = await prisma.discipline.findFirst({
    where: { translationId: csTranslation.id },
  });
  if (!csDiscipline) {
    throw new Error('Computer Science discipline not found.');
  }

  for (const course of colmanCsCourses) {
    // Ensure translation exists
    let translation = await cache.getTranslation(prisma, course.en_text);
    if (!translation) {
      translation = await prisma.translation.create({
        data: {
          id: course.id,
          en_text: course.en_text,
          he_text: course.he_text,
        },
      });
    }

    // Ensure course exists
    const existingCourse = await prisma.course.findFirst({
      where: {
        translationId: translation.id,
        universityId: colmanUniversity.id,
        disciplineId: csDiscipline.id,
      },
    });
    if (!existingCourse) {
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
          disciplineId: csDiscipline.id,
          blockId: course.blockId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }
  console.log('Colman courses seeded successfully.');
};
