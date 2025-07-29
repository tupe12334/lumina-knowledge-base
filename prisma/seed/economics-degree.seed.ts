import { Prisma } from '../../generated/client';
import { THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME } from './universities.consts';

export async function seedEconomicsDegree(prisma: Prisma.TransactionClient) {
  // Find the Economics degree translation
  const degreeTranslation = await prisma.translation.findFirst({
    where: { en_text: 'Economics' },
  });
  if (!degreeTranslation) {
    throw new Error(
      `Translation for degree 'Economics' not found. Seed translations first.`,
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

  // Find the Economics discipline
  const discipline = await prisma.discipline.findFirst({
    where: {
      name: {
        en_text: 'Economics',
      },
      faculty: {
        universityId: university.id,
      },
    },
  });
  if (!discipline) {
    throw new Error(
      `Discipline 'Economics' not found for university '${THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME}'. Seed disciplines first.`,
    );
  }

  // Create the Economics degree if it doesn't exist
  let degree = await prisma.degree.findFirst({
    where: {
      translationId: degreeTranslation.id,
      universityId: university.id,
    },
  });

  if (!degree) {
    degree = await prisma.degree.create({
      data: {
        id: '17004398-f4fe-4658-a023-f79283bf22de',
        translationId: degreeTranslation.id,
        universityId: university.id,
        disciplineId: discipline.id,
      },
    });
    console.log(
      `Seeded degree 'Economics' at '${THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME}'.`,
    );
  }

  // Link courses to the Economics degree
  const courseNames = [
    'Introduction to Macroeconomics',
    'Introduction to Microeconomics',
    'Macroeconomics A',
    'Macroeconomics B',
    'Microeconomics A',
    'Microeconomics B',
    'Microeconomics C',
    'Differential Calculus for Economics and Management Students',
    'Introduction to Statistics for Social Sciences A',
    'Introduction to Statistics for Social Sciences B',
    'Topics in Mathematics for Social Sciences Students',
    'Basic Concepts in Econometrics',
    'The Economics of Israel',
    'Public Economics',
    'Labor Economics',
    'International Real Economics',
    'Social Preference and Choice',
    'Intergenerational Economics',
    'Auctions and Electronic Markets: Mechanism Design and Algorithms',
    'Strategic Thinking: Game Theory and its Applications in Economics and Management',
    'Monetary Economics',
    'Political Economy',
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
        console.log(`Connected course '${courseName}' to degree 'Economics'.`);
      }
    } else {
      console.warn(
        `Course '${courseName}' not found for university '${THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME}'. Seed courses first.`,
      );
    }
  }
}
