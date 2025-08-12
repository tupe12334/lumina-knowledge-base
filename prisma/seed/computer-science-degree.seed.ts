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
    'Introduction to Computer Science and Java',
    'Data Structures and Introduction to Algorithms',
    'Algorithms',
    'Systems Programming Laboratory',
    'Automata and Formal Languages',
    'Introduction to Computability and Complexity Theory',
    'Computational Models',
    'Computer Organization',
    'Logic for Computer Science Students',
    'Operating Systems',
    'Programming Languages',
    'Database Systems',
    'Principles of Information Systems Development',
    'Coding Theory',
    'Numerical Analysis 1',
    'Programming and Data Analysis in Python',
    'Introduction to Artificial Intelligence',
    'Advanced Java Programming',
    'Computer Networks',
    'Defensive System Programming',
    'Computer Graphics',
    'Introduction to Cryptography',
    'Compilation',
    'Object-Oriented Programming',
    'Data Systems – Technologies and Algorithms',
    'Computational Biology',
    'Data Mining',
    'Numerical Analysis 2',
    'Introduction to Computational Learning',
    'Algorithmic Robotics',
    'Introduction to Cybersecurity',
    'Introduction to Software Testing',
    'Computational Geometry',
    'Foundations of Mathematics',
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
