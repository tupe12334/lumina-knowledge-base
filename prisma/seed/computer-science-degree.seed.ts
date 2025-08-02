import { Prisma } from '../../generated/client';
import { THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME } from './universities.consts';

export async function seedComputerScienceDegree(
  prisma: Prisma.TransactionClient,
) {
  // Find the Computer Science degree translation
  const degreeTranslation = await prisma.translation.findFirst({
    where: { en_text: 'Computer Science' },
  });
  if (!degreeTranslation) {
    throw new Error(
      `Translation for degree 'Computer Science' not found. Seed translations first.`,
    );
  }

  // Find The Open University of Israel
  const university = await prisma.university.findFirst({
    where: {
      name: {
        en_text: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
      },
    },
  });
  if (!university) {
    throw new Error(
      `University '${THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME}' not found. Seed universities first.`,
    );
  }

  // Create the Computer Science degree if it doesn't exist
  let degree = await prisma.degree.findFirst({
    where: {
      translationId: degreeTranslation.id,
      universityId: university.id,
    },
  });

  if (!degree) {
    degree = await prisma.degree.create({
      data: {
        id: '3067B4C1-2388-4402-9ABD-70A34CF916F2',
        translationId: degreeTranslation.id,
        universityId: university.id,
      },
    });
    console.log(
      `Seeded degree 'Computer Science' at '${THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME}'.`,
    );
  }

  // Link courses to the Computer Science degree
  const courseNames = [
    'Computational Models',
    'Computer Organization',
    'Defensive Systems Programming',
  ];

  for (const courseName of courseNames) {
    const course = await prisma.course.findFirst({
      where: {
        name: {
          en_text: courseName,
        },
        universityId: university.id,
      },
    });

    if (course) {
      const existingConnection = await prisma.course.findFirst({
        where: {
          id: course.id,
          Degree: { some: { id: degree.id } },
        },
      });

      if (!existingConnection) {
        await prisma.course.update({
          where: { id: course.id },
          data: {
            Degree: { connect: { id: degree.id } },
          },
        });
        console.log(
          `Connected course '${courseName}' to degree 'Computer Science'.`,
        );
      }
    } else {
      console.warn(
        `Course '${courseName}' not found for university '${THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME}'. Seed courses first.`,
      );
    }
  }
}
