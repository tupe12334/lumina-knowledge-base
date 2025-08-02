import { Prisma, Module, Course } from '../../generated/client';
import { SeedCache } from './cache';

// Hardcoded UUIDs for physics modules seed data
const TRANSLATION_IDS = {
  SI_SYSTEM: '4f03419d-824b-475b-9776-e19e2ef5e05b',
  BASIC_UNITS: '0485bd88-355c-4182-9872-761027a789bc',
  DERIVED_UNITS: '0212a036-0bc4-4b57-aa5c-a53bd2b2b0cd',
  ONE_DIM_KINEMATICS: 'b22aeac6-0c02-4416-96ab-39ccb8c76fef',
  AVERAGE_VELOCITY: '0c2e8134-7447-4651-8f05-1c344abbc63d',
  INSTANTANEOUS_VELOCITY: 'f45fe408-de64-4efe-8c5d-4494d61593be',
  TWO_DIM_GRAPH: '8f3e1184-9cb6-4a73-b3b9-84fa1071cb72',
  DISTANCE_QUESTION: '0f6c1fe3-9c33-48d4-8c9c-02769fed838f',
  AREA_QUESTION: '66125eb8-6c39-41ce-95a2-35bf9e9c071f',
  NUMBER_SYSTEMS: 'd4807da7-6b88-4866-8e16-6072866fa813',
  MICROECONOMICS_A: 'd7f5d006-9370-4585-824b-fefb7a5f4ebf',
  MICROECONOMICS_B: '4479b604-87f7-4b25-b560-a20900411698',
  MICROECONOMICS_C: 'cc457311-d797-47e6-ab1a-180183093517',
  INTRO_CS_JAVA: '822e354b-1518-482f-a731-171016f30be0',
  FOUNDATIONS_PHYSICS_B: 'd33c1c3b-5718-4840-9e5a-799d34684913',
  LABOR_ECONOMICS: '3e6934f9-34c5-409e-a300-a386a6903558',
  MONETARY_ECONOMICS: 'e338c249-db8d-406a-ad27-e3840f67ba71',
  ALGORITHMS: '6d57b907-b7f5-4f44-ae8d-bc98749ff3e1',
  DATABASE_SYSTEMS: 'eec74051-936c-4838-8309-ba84f856f8c8',
} as const;

const BLOCK_IDS = {
  SI_SYSTEM: '223f283a-42fd-49c9-974d-92a81fe0fa4c',
  BASIC_UNITS: 'a0b0dc7e-c812-4b45-944f-c21237834b05',
  DERIVED_UNITS: '7ebfbdbd-07ae-47be-8d04-77d2ac284e3c',
  ONE_DIM_KINEMATICS: 'a7250f2a-255c-4e5e-a984-026f118e29cf',
  AVERAGE_VELOCITY: 'ae5f3bfd-bf5e-43d6-8226-5298d30b5843',
  INSTANTANEOUS_VELOCITY: '86436726-62a8-43bc-b63b-70e632f77d0d',
  TWO_DIM_GRAPH: '30473cde-596b-4a7f-8de5-0cff360067f0',
  NUMBER_SYSTEMS: 'cf33e7e4-90ee-4b2c-858c-7f2c829e191b',
  MICROECONOMICS_A: '1b095b22-afe2-4ef2-8e1f-ec539679793f',
  MICROECONOMICS_B: 'c8bf3b02-54a0-4b96-98dc-88daa6404979',
  MICROECONOMICS_C: '401b48ba-6da0-4dfd-bd50-aa134c587012',
  INTRO_CS_JAVA: '63eee27d-3780-44f9-9eda-7d770c4223f1',
  FOUNDATIONS_PHYSICS_B: '7f0aa65f-2cee-44b6-bc47-5d9ed8218eb0',
  LABOR_ECONOMICS: '7cb08422-8c6c-4e65-973e-b31313bd62ad',
  MONETARY_ECONOMICS: 'fb7c0769-e30e-4507-9694-8f7857cc91c2',
  ALGORITHMS: '482b9a55-0b38-4896-a152-d5bdc2a9251a',
  DATABASE_SYSTEMS: 'da93a9cf-59c8-4f2f-a81a-aa6b52d2a607',
} as const;

const MODULE_IDS = {
  SI_SYSTEM: '83c79ef7-21a4-4a09-a3a7-eef6e51d674e',
  BASIC_UNITS: 'a580440b-7d7b-4cd9-8c25-cd89f23ea07d',
  DERIVED_UNITS: 'e4244fa9-ffc9-415d-a289-fe2f3f7d7de3',
  ONE_DIM_KINEMATICS: '9482d2c0-bc65-4391-8946-64da2143db4d',
  AVERAGE_VELOCITY: '0f907f93-ae10-4bf5-bfe4-71aeeb18e23f',
  INSTANTANEOUS_VELOCITY: '705c7120-fc69-4d43-a4fe-67cd12b571ea',
  TWO_DIM_GRAPH: 'aaa3ca49-7120-4c08-9957-0ec5b25539e4',
  NUMBER_SYSTEMS: 'eba4435c-90b5-4098-ba1d-548e58730e88',
} as const;

const QUESTION_IDS = {
  DISTANCE_QUESTION: '3868f16c-c4e5-4df1-9c2e-eeafe926473d',
  AREA_QUESTION: '0b289b7e-74f3-48af-8096-aa5601fceb1a',
} as const;

const ANSWER_IDS = {
  DISTANCE_ANSWER: 'df5c4ed7-7109-4c20-88dd-87e05833d16f',
  AREA_ANSWER: '05fe080d-0020-4f11-828e-0aa87dfe2cdd',
} as const;

const RELATIONSHIP_IDS = {
  BASIC_TO_DERIVED: 'a14436c4-4fa6-47b4-ae00-e6a00cf43d5e',
  SI_TO_KINEMATICS: 'ac956ac8-b5aa-431a-b8ec-c81d7c5f1c29',
} as const;

// Additional IDs for courses and relationships in seedAdditionalCoursesAndRelationships
const ADDITIONAL_COURSE_IDS = {
  MICROECONOMICS_A: 'e5102cee-1add-4236-8342-b37154225491',
  MICROECONOMICS_B: 'd164f005-0f44-40c7-ae46-55b4da9ff2a6',
  MICROECONOMICS_C: 'aef26488-fe14-4e2b-bc77-e0177f34a4a2',
  INTRO_CS_JAVA: '545b5d89-de81-48d5-90e8-e0c1061cfb1f',
  FOUNDATIONS_PHYSICS_B: '5909e8f5-b8f5-4b14-980f-702847ed186a',
  LABOR_ECONOMICS: '398a9b68-0c77-4dc1-a570-bd9f1b7dac8d',
  MONETARY_ECONOMICS: '8126d162-4b06-4539-a268-31b85c708afd',
  ALGORITHMS: '7ad223ef-d7aa-497c-95ae-b79e102f6f24',
  DATABASE_SYSTEMS: 'f74e6509-a1d5-471e-8360-311bcc020cbe',
} as const;

const ADDITIONAL_RELATIONSHIP_IDS = [
  '4a400758-507b-4ff0-9799-026577878064', // Microeconomics A -> B
  '0453e0f1-4917-4334-86e1-e8c2e76603e7', // Microeconomics B -> C
  'ea241395-98bd-415a-939a-53d3c9ec4275', // Intro CS Java -> Database Systems
  'd6eeb1a2-abcb-4603-b566-a15a5d2d0add', // Microeconomics B -> Labor Economics
  'a43463ae-87bf-47cc-9d20-e6b134646a7d', // Macroeconomics B -> Labor Economics
  '633b68fd-4e69-4729-bb25-59d2c804360e', // Microeconomics B -> Monetary Economics
  '17e22da8-7481-44c8-b7cc-cd19577efe8f', // Macroeconomics B -> Monetary Economics
  'ac73be63-69fa-4224-8f36-7634587ccb16', // Discrete Mathematics -> Logic for Computer Science
  '45ddf9f9-ad99-4216-bd71-e74222f0061f', // Intro CS Java -> Computer Organization
] as const;

let relationshipIdIndex = 0;

// Additional IDs for metadata
const METADATA_IDS = [
  'b1ca7937-494b-44af-840b-933bea047e36', // Basic to Derived metadata
  '6eb957c8-6aa6-4d2b-b6c7-f788807031a6', // SI to Kinematics metadata
  '671a9817-b041-4598-a52d-6bebe6d71e57', // Microeconomics A -> B metadata
  '166270e8-1c12-4db3-8ac9-22edbb29704b', // Microeconomics B -> C metadata
  '3e768882-16cd-4bf1-9635-8a7ee0fc8422', // Intro CS Java -> Database Systems metadata
  '03fb3cbd-f43f-4283-92da-2baa53d001b6', // Microeconomics B -> Labor Economics metadata
  '45333a09-7237-4096-b035-553cae36dd7d', // Macroeconomics B -> Labor Economics metadata
  'f5c5cccf-53c6-45bb-a329-5247e3b1928b', // Microeconomics B -> Monetary Economics metadata
  '404e4afc-60be-488c-a8c1-4ec7c0756776', // Macroeconomics B -> Monetary Economics metadata
  'da4f0d2d-9226-4eea-b779-ceab8b7390bb', // Discrete Mathematics -> Logic for Computer Science metadata
  'fdeb8791-9b5f-4389-8b64-72964356bab4', // Intro CS Java -> Computer Organization metadata
] as const;

const SELECT_ANSWER_IDS = [
  '3c99eef6-652f-4dac-8fe2-9191f02ffc38', // Distance question select answer 1
  '3065e157-6f71-4c33-a682-5022723f8391', // Distance question select answer 2
  'ac218326-9512-4383-8945-4303931d7457', // Distance question select answer 3
] as const;

const UNIT_ANSWER_IDS = [
  '85390d3a-b92b-41d6-877a-925ae6a93f32', // Area question unit answer
] as const;

let metadataIdIndex = 0;
let selectAnswerIdIndex = 0;

// Helper functions to get hardcoded IDs
const getTranslationId = (name: string): string => {
  switch (name) {
    case 'SI System':
      return TRANSLATION_IDS.SI_SYSTEM;
    case 'Basic Units':
      return TRANSLATION_IDS.BASIC_UNITS;
    case 'Derived Units':
      return TRANSLATION_IDS.DERIVED_UNITS;
    case 'One Dimensional Kinematics':
      return TRANSLATION_IDS.ONE_DIM_KINEMATICS;
    case 'Average Velocity':
      return TRANSLATION_IDS.AVERAGE_VELOCITY;
    case 'Instantaneous Velocity':
      return TRANSLATION_IDS.INSTANTANEOUS_VELOCITY;
    case 'Two Dimensional Graph Reading':
      return TRANSLATION_IDS.TWO_DIM_GRAPH;
    case 'Number Systems':
      return TRANSLATION_IDS.NUMBER_SYSTEMS;
    case 'Microeconomics A':
      return TRANSLATION_IDS.MICROECONOMICS_A;
    case 'Microeconomics B':
      return TRANSLATION_IDS.MICROECONOMICS_B;
    case 'Microeconomics C':
      return TRANSLATION_IDS.MICROECONOMICS_C;
    case 'Introduction to Computer Science and Java':
      return TRANSLATION_IDS.INTRO_CS_JAVA;
    case 'Foundations of Physics B':
      return TRANSLATION_IDS.FOUNDATIONS_PHYSICS_B;
    case 'Labor Economics':
      return TRANSLATION_IDS.LABOR_ECONOMICS;
    case 'Monetary Economics':
      return TRANSLATION_IDS.MONETARY_ECONOMICS;
    case 'Algorithms':
      return TRANSLATION_IDS.ALGORITHMS;
    case 'Database Systems':
      return TRANSLATION_IDS.DATABASE_SYSTEMS;
    case 'Which of the following three distances is the largest, which one is the smallest?':
      return TRANSLATION_IDS.DISTANCE_QUESTION;
    case 'Calculate the area, in square meters (m²), of a rectangle with a length of 80 cm and a width of 120 cm.':
      return TRANSLATION_IDS.AREA_QUESTION;
    default:
      throw new Error(`No translation ID found for: ${name}`);
  }
};

const getBlockId = (name: string): string => {
  switch (name) {
    case 'SI System':
      return BLOCK_IDS.SI_SYSTEM;
    case 'Basic Units':
      return BLOCK_IDS.BASIC_UNITS;
    case 'Derived Units':
      return BLOCK_IDS.DERIVED_UNITS;
    case 'One Dimensional Kinematics':
      return BLOCK_IDS.ONE_DIM_KINEMATICS;
    case 'Average Velocity':
      return BLOCK_IDS.AVERAGE_VELOCITY;
    case 'Instantaneous Velocity':
      return BLOCK_IDS.INSTANTANEOUS_VELOCITY;
    case 'Two Dimensional Graph Reading':
      return BLOCK_IDS.TWO_DIM_GRAPH;
    case 'Number Systems':
      return BLOCK_IDS.NUMBER_SYSTEMS;
    case 'Microeconomics A':
      return BLOCK_IDS.MICROECONOMICS_A;
    case 'Microeconomics B':
      return BLOCK_IDS.MICROECONOMICS_B;
    case 'Microeconomics C':
      return BLOCK_IDS.MICROECONOMICS_C;
    case 'Introduction to Computer Science and Java':
      return BLOCK_IDS.INTRO_CS_JAVA;
    case 'Foundations of Physics B':
      return BLOCK_IDS.FOUNDATIONS_PHYSICS_B;
    case 'Labor Economics':
      return BLOCK_IDS.LABOR_ECONOMICS;
    case 'Monetary Economics':
      return BLOCK_IDS.MONETARY_ECONOMICS;
    case 'Algorithms':
      return BLOCK_IDS.ALGORITHMS;
    case 'Database Systems':
      return BLOCK_IDS.DATABASE_SYSTEMS;
    default:
      throw new Error(`No block ID found for: ${name}`);
  }
};

const getModuleId = (name: string): string => {
  switch (name) {
    case 'SI System':
      return MODULE_IDS.SI_SYSTEM;
    case 'Basic Units':
      return MODULE_IDS.BASIC_UNITS;
    case 'Derived Units':
      return MODULE_IDS.DERIVED_UNITS;
    case 'One Dimensional Kinematics':
      return MODULE_IDS.ONE_DIM_KINEMATICS;
    case 'Average Velocity':
      return MODULE_IDS.AVERAGE_VELOCITY;
    case 'Instantaneous Velocity':
      return MODULE_IDS.INSTANTANEOUS_VELOCITY;
    case 'Two Dimensional Graph Reading':
      return MODULE_IDS.TWO_DIM_GRAPH;
    case 'Number Systems':
      return MODULE_IDS.NUMBER_SYSTEMS;
    default:
      throw new Error(`No module ID found for: ${name}`);
  }
};

const getCourseId = (name: string): string => {
  switch (name) {
    case 'Microeconomics A':
      return ADDITIONAL_COURSE_IDS.MICROECONOMICS_A;
    case 'Microeconomics B':
      return ADDITIONAL_COURSE_IDS.MICROECONOMICS_B;
    case 'Microeconomics C':
      return ADDITIONAL_COURSE_IDS.MICROECONOMICS_C;
    case 'Introduction to Computer Science and Java':
      return ADDITIONAL_COURSE_IDS.INTRO_CS_JAVA;
    case 'Foundations of Physics B':
      return ADDITIONAL_COURSE_IDS.FOUNDATIONS_PHYSICS_B;
    case 'Labor Economics':
      return ADDITIONAL_COURSE_IDS.LABOR_ECONOMICS;
    case 'Monetary Economics':
      return ADDITIONAL_COURSE_IDS.MONETARY_ECONOMICS;
    case 'Algorithms':
      return ADDITIONAL_COURSE_IDS.ALGORITHMS;
    case 'Database Systems':
      return ADDITIONAL_COURSE_IDS.DATABASE_SYSTEMS;
    default:
      throw new Error(`No course ID found for: ${name}`);
  }
};

export const seedPhysicsModulesAndQuestions = async (
  tx: Prisma.TransactionClient,
  cache: SeedCache,
) => {
  console.log('Seeding physics modules and questions...');

  // Insert Modules for Foundations of Physics A course
  const physicsModules = [
    { en_name: 'SI System', he_name: 'מערכת היחידות הבין לאומיות' },
    { en_name: 'Basic Units', he_name: 'יחידות בסיסיות' },
    { en_name: 'Derived Units', he_name: 'יחידות נגזרות' },
    { en_name: 'One Dimensional Kinematics', he_name: 'קינמטיקה חד ממדית' },
    { en_name: 'Average Velocity', he_name: 'מהירות ממוצעת' },
    { en_name: 'Instantaneous Velocity', he_name: 'מהירות רגעית' },
    {
      en_name: 'Two Dimensional Graph Reading',
      he_name: 'קריאת גרפים דו ממדית',
    },
  ];

  // Get the Foundations of Physics A course
  const physicsCourse = await tx.course.findFirst({
    where: {
      name: {
        en_text: 'Foundations of Physics A',
      },
    },
    include: { name: true },
  });

  if (!physicsCourse) {
    console.log(
      'Foundations of Physics A course not found, skipping physics modules',
    );
    return;
  }

  // Create modules and link them to the course
  const createdModules: Record<string, Module> = {};
  for (const moduleData of physicsModules) {
    // Check if translation exists
    let translation = await cache.getTranslation(tx, moduleData.en_name);

    if (!translation) {
      const translationId = getTranslationId(moduleData.en_name);
      translation = await tx.translation.create({
        data: {
          id: translationId,
          en_text: moduleData.en_name,
          he_text: moduleData.he_name,
        },
      });
    }

    // Check if module already exists
    let module = await tx.module.findFirst({
      where: { translationId: translation.id },
    });

    if (!module) {
      // Create block for the module
      const blockId = getBlockId(moduleData.en_name);
      const block = await tx.block.create({
        data: {
          id: blockId,
        },
      });

      // Create module
      const moduleId = getModuleId(moduleData.en_name);
      module = await tx.module.create({
        data: {
          id: moduleId,
          translationId: translation.id,
          blockId: block.id,
        },
      });

      // Link module to course
      await tx.course.update({
        where: { id: physicsCourse.id },
        data: {
          modules: {
            connect: { id: module.id },
          },
        },
      });
    }

    createdModules[moduleData.en_name] = module;
  }

  // Set up module hierarchy: SI System as parent of Basic Units and Derived Units
  const siModule = createdModules['SI System'];
  const basicModule = createdModules['Basic Units'];
  const derivedModule = createdModules['Derived Units'];
  const kinematicsModule = createdModules['One Dimensional Kinematics'];
  const averageModule = createdModules['Average Velocity'];
  const instantaneousModule = createdModules['Instantaneous Velocity'];

  if (siModule && basicModule) {
    await tx.module.update({
      where: { id: siModule.id },
      data: {
        subModules: {
          connect: { id: basicModule.id },
        },
      },
    });
  }

  if (siModule && derivedModule) {
    await tx.module.update({
      where: { id: siModule.id },
      data: {
        subModules: {
          connect: { id: derivedModule.id },
        },
      },
    });
  }

  if (kinematicsModule && averageModule) {
    await tx.module.update({
      where: { id: kinematicsModule.id },
      data: {
        subModules: {
          connect: { id: averageModule.id },
        },
      },
    });
  }

  if (kinematicsModule && instantaneousModule) {
    await tx.module.update({
      where: { id: kinematicsModule.id },
      data: {
        subModules: {
          connect: { id: instantaneousModule.id },
        },
      },
    });
  }

  // Set up prerequisites: Basic Units is prerequisite for Derived Units
  if (basicModule && derivedModule) {
    // Check if relationship already exists
    const existingRelationship = await tx.blockRelationship.findFirst({
      where: {
        prerequisiteId: basicModule.blockId,
        postrequisiteId: derivedModule.blockId,
      },
    });

    if (!existingRelationship) {
      const blockRelationship = await tx.blockRelationship.upsert({
        where: { id: RELATIONSHIP_IDS.BASIC_TO_DERIVED },
        update: {},
        create: {
          id: RELATIONSHIP_IDS.BASIC_TO_DERIVED,
          prerequisiteId: basicModule.blockId,
          postrequisiteId: derivedModule.blockId,
        },
      });

      // Check if metadata already exists for this relationship
      const existingMetadata = await tx.relationshipMetadata.findFirst({
        where: {
          blockRelationshipId: blockRelationship.id,
          key: 'TYPE',
        },
      });

      if (!existingMetadata) {
        await tx.relationshipMetadata.create({
          data: {
            id: METADATA_IDS[metadataIdIndex++],
            blockRelationshipId: blockRelationship.id,
            key: 'TYPE',
            value: 'hard',
          },
        });
      }
    }
  }

  // Set up prerequisite: SI System is prerequisite for One Dimensional Kinematics
  if (siModule && kinematicsModule) {
    // Check if relationship already exists
    const existingRelationship = await tx.blockRelationship.findFirst({
      where: {
        prerequisiteId: siModule.blockId,
        postrequisiteId: kinematicsModule.blockId,
      },
    });

    if (!existingRelationship) {
      const blockRelationship = await tx.blockRelationship.upsert({
        where: { id: RELATIONSHIP_IDS.SI_TO_KINEMATICS },
        update: {},
        create: {
          id: RELATIONSHIP_IDS.SI_TO_KINEMATICS,
          prerequisiteId: siModule.blockId,
          postrequisiteId: kinematicsModule.blockId,
        },
      });

      // Check if metadata already exists for this relationship
      const existingMetadata = await tx.relationshipMetadata.findFirst({
        where: {
          blockRelationshipId: blockRelationship.id,
          key: 'TYPE',
        },
      });

      if (!existingMetadata) {
        await tx.relationshipMetadata.create({
          data: {
            id: METADATA_IDS[metadataIdIndex++],
            blockRelationshipId: blockRelationship.id,
            key: 'TYPE',
            value: 'hard',
          },
        });
      }
    }
  }

  // Insert question about distance comparison
  const distanceQuestionText =
    'Which of the following three distances is the largest, which one is the smallest?';
  let distanceTranslation = await cache.getTranslation(
    tx,
    distanceQuestionText,
  );

  if (!distanceTranslation) {
    distanceTranslation = await tx.translation.create({
      data: {
        id: getTranslationId(distanceQuestionText),
        en_text: distanceQuestionText,
        he_text: 'איזה מהמרחקים הבאים הוא הגדול ביותר, איזה הוא הקטן ביותר?',
      },
    });
  }

  let distanceQuestion = await tx.question.findFirst({
    where: { translationId: distanceTranslation.id },
  });

  if (!distanceQuestion && basicModule) {
    distanceQuestion = await tx.question.create({
      data: {
        id: QUESTION_IDS.DISTANCE_QUESTION,
        translationId: distanceTranslation.id,
        type: 'selection',
        Modules: {
          connect: { id: basicModule.id },
        },
      },
    });

    // Create answer for distance question
    const distanceAnswer = await tx.answer.create({
      data: {
        id: ANSWER_IDS.DISTANCE_ANSWER,
        questionId: distanceQuestion.id,
      },
    });

    // Create select answers
    const selectAnswers = [
      {
        id: '3c99eef6-652f-4dac-8fe2-9191f02ffc38',
        translationId: 'a34d7a4b-9f41-4739-becb-a920ec24f13c',
        text: { en_text: '0.7 km', he_text: '0.7 ק״מ' },
        isCorrect: false,
      },
      {
        id: '3065e157-6f71-4c33-a682-5022723f8391',
        translationId: 'AF770977-4B29-4444-B907-F819EF5D0BEA',
        text: { en_text: '7,100 cm', he_text: '7,100 ס״מ' },
        isCorrect: false,
      },
      {
        id: 'ac218326-9512-4383-8945-4303931d7457',
        translationId: 'EE38E69B-F2B3-477E-A06A-70EBB3E5F87D',
        text: {
          en_text: '6.9*10^6 millimeters',
          he_text: '6.9*10^6 מילימטרים',
        },
        isCorrect: true,
      },
    ];

    for (const selectAnswerData of selectAnswers) {
      // Create translation for the select answer
      const selectAnswerTranslation = await tx.translation.upsert({
        where: { id: selectAnswerData.translationId },
        update: {
          en_text: selectAnswerData.text.en_text,
          he_text: selectAnswerData.text.he_text,
        },
        create: {
          id: selectAnswerData.translationId,
          en_text: selectAnswerData.text.en_text,
          he_text: selectAnswerData.text.he_text,
        },
      });

      await tx.selectAnswer.create({
        data: {
          id: selectAnswerData.id,
          isCorrect: selectAnswerData.isCorrect,
          text: { connect: { id: selectAnswerTranslation.id } },
          answer: { connect: { id: distanceAnswer.id } },
        },
      });
    }
  }

  // Insert question about area calculation for Derived Units
  const areaQuestionText =
    'Calculate the area, in square meters (m²), of a rectangle with a length of 80 cm and a width of 120 cm.';
  let areaTranslation = await cache.getTranslation(tx, areaQuestionText);

  if (!areaTranslation) {
    areaTranslation = await tx.translation.create({
      data: {
        id: getTranslationId(areaQuestionText),
        en_text: areaQuestionText,
        he_text:
          'חשב את השטח, במטרים רבועים (m²), של מלבן באורך 80 ס"מ וברוחב 120 ס"מ.',
      },
    });
  }

  let areaQuestion = await tx.question.findFirst({
    where: { translationId: areaTranslation.id },
  });

  if (!areaQuestion && derivedModule) {
    areaQuestion = await tx.question.create({
      data: {
        id: QUESTION_IDS.AREA_QUESTION,
        translationId: areaTranslation.id,
        type: 'value',
        Modules: {
          connect: { id: derivedModule.id },
        },
      },
    });

    // Create answer for area question
    const areaAnswer = await tx.answer.create({
      data: {
        id: ANSWER_IDS.AREA_ANSWER,
        questionId: areaQuestion.id,
      },
    });

    // Create unit answer
    await tx.unitAnswer.create({
      data: {
        id: UNIT_ANSWER_IDS[0],
        value: 0.96,
        unit: 'meter',
        answerId: areaAnswer.id,
      },
    });
  }

  // Insert 'Number Systems' module and link it to Calculus courses
  let numberSystemsTranslation = await cache.getTranslation(
    tx,
    'Number Systems',
  );

  if (!numberSystemsTranslation) {
    numberSystemsTranslation = await tx.translation.create({
      data: {
        id: getTranslationId('Number Systems'),
        en_text: 'Number Systems',
        he_text: 'מערכות מספרים',
      },
    });
  }

  let numberSystemsModule = await tx.module.findFirst({
    where: { translationId: numberSystemsTranslation.id },
  });

  if (!numberSystemsModule) {
    // Create block for the module
    const block = await tx.block.create({
      data: {
        id: getBlockId('Number Systems'),
      },
    });

    numberSystemsModule = await tx.module.create({
      data: {
        id: getModuleId('Number Systems'),
        translationId: numberSystemsTranslation.id,
        blockId: block.id,
      },
    });

    // Link to Infinitesimal Calculus 1 course
    const calculusCourse = await tx.course.findFirst({
      where: {
        name: {
          en_text: 'Infinitesimal Calculus 1',
        },
      },
    });

    if (calculusCourse) {
      await tx.course.update({
        where: { id: calculusCourse.id },
        data: {
          modules: {
            connect: { id: numberSystemsModule.id },
          },
        },
      });
    }
  }

  // Insert Economics and Mathematics degrees
  const openUniversity = await tx.university.findFirst({
    where: {
      name: {
        en_text: 'The Open University Of Israel',
      },
    },
  });

  if (openUniversity) {
    // Insert Economics degree
    const economicsTranslation = await cache.getTranslation(tx, 'Economics');

    if (economicsTranslation) {
      const existingEconomicsDegree = await tx.degree.findFirst({
        where: {
          translationId: economicsTranslation.id,
          universityId: openUniversity.id,
        },
      });

      if (!existingEconomicsDegree) {
        const economicsDegree = await tx.degree.create({
          data: {
            translationId: economicsTranslation.id,
            universityId: openUniversity.id,
          },
        });

        // Link relevant courses to the Economics degree
        const economicsCourses = [
          'Introduction to Macroeconomics',
          'Introduction to Microeconomics',
          'Macroeconomics A',
          'Macroeconomics B',
          'Differential Calculus for Economics and Management Students',
          'Introduction to Statistics for Social Sciences A',
          'Introduction to Statistics for Social Sciences B',
          'Topics in Mathematics for Social Sciences Students',
        ];

        for (const courseName of economicsCourses) {
          const course = await tx.course.findFirst({
            where: {
              name: {
                en_text: courseName,
              },
            },
          });

          if (course) {
            await tx.degree.update({
              where: { id: economicsDegree.id },
              data: {
                courses: {
                  connect: { id: course.id },
                },
              },
            });
          }
        }
      }
    }

    // Insert Mathematics degree
    const mathematicsTranslation = await cache.getTranslation(
      tx,
      'Mathematics',
    );

    if (mathematicsTranslation) {
      const existingMathDegree = await tx.degree.findFirst({
        where: {
          translationId: mathematicsTranslation.id,
          universityId: openUniversity.id,
        },
      });

      if (!existingMathDegree) {
        const mathDegree = await tx.degree.create({
          data: {
            translationId: mathematicsTranslation.id,
            universityId: openUniversity.id,
          },
        });

        // Link relevant courses to the Mathematics degree
        const mathCourses = [
          'Infinitesimal Calculus 2',
          'Linear Algebra 1',
          'Linear Algebra 2',
          'Discrete Mathematics',
          'Introduction to Differential Equations',
          'Introduction to Statistics and Probability for Science Students',
          'Statistical Inference',
          'Logic for Computer Science Students',
          'Probability and Introduction to Statistics for Computer Science',
        ];

        for (const courseName of mathCourses) {
          const course = await tx.course.findFirst({
            where: {
              name: {
                en_text: courseName,
              },
            },
          });

          if (course) {
            await tx.degree.update({
              where: { id: mathDegree.id },
              data: {
                courses: {
                  connect: { id: course.id },
                },
              },
            });
          }
        }
      }
    }
  }

  console.log('Physics modules and questions seeded successfully.');

  // Seed additional courses and relationships
  await seedAdditionalCoursesAndRelationships(tx, cache);
};

const seedAdditionalCoursesAndRelationships = async (
  tx: Prisma.TransactionClient,
  cache: SeedCache,
) => {
  relationshipIdIndex = 0; // Reset index for this function
  console.log('Seeding additional courses and relationships...');

  // Get the Open University
  const openUniversity = await tx.university.findFirst({
    where: {
      name: {
        en_text: 'The Open University Of Israel',
      },
    },
  });

  if (!openUniversity) {
    console.log('Open University not found, skipping additional courses');
    return;
  }

  // Course data without discipline mapping
  const coursesData = [
    { en_name: 'Microeconomics A' },
    { en_name: 'Microeconomics B' },
    { en_name: 'Microeconomics C' },
    {
      en_name: 'Introduction to Computer Science and Java',
    },
    { en_name: 'Foundations of Physics B' },
    {
      en_name: 'Logic for Computer Science Students',
      id: '7f07e5e6-f959-406d-9f93-3ff46d2bc146',
      publishedAt: new Date('2025-06-22'),
    },
    { en_name: 'Labor Economics' },
    {
      en_name: 'Monetary Economics',
      publishedAt: new Date('2025-07-10'),
    },
    { en_name: 'Algorithms' },
    { en_name: 'Database Systems' },
  ];

  // Create courses
  const createdCourses: Record<string, Course> = {};
  for (const courseData of coursesData) {
    // Check if translation exists
    let translation = await cache.getTranslation(tx, courseData.en_name);

    if (!translation) {
      translation = await tx.translation.create({
        data: {
          id: getTranslationId(courseData.en_name),
          en_text: courseData.en_name,
          he_text: courseData.en_name, // Using English name as Hebrew for now
        },
      });
    }

    // Check if course already exists
    let course = await tx.course.findFirst({
      where: { translationId: translation.id },
    });

    if (!course) {
      // Create block for the course
      const block = await tx.block.create({
        data: {
          id: getBlockId(courseData.en_name),
        },
      });

      // Create course
      course = await tx.course.create({
        data: {
          ...(courseData.id
            ? { id: courseData.id }
            : { id: getCourseId(courseData.en_name) }),
          translationId: translation.id,
          universityId: openUniversity.id,
          blockId: block.id,
          ...(courseData.publishedAt
            ? { publishedAt: courseData.publishedAt }
            : {}),
        },
      });
    }

    createdCourses[courseData.en_name] = course;
  }

  // Set up course prerequisites
  const prerequisites = [
    { prerequisite: 'Microeconomics A', postrequisite: 'Microeconomics B' },
    { prerequisite: 'Microeconomics B', postrequisite: 'Microeconomics C' },
    {
      prerequisite: 'Introduction to Computer Science and Java',
      postrequisite: 'Database Systems',
    },
    {
      prerequisite: 'Microeconomics B',
      postrequisite: 'Labor Economics',
    },
    {
      prerequisite: 'Macroeconomics B',
      postrequisite: 'Labor Economics',
    },
    {
      prerequisite: 'Microeconomics B',
      postrequisite: 'Monetary Economics',
    },
    {
      prerequisite: 'Macroeconomics B',
      postrequisite: 'Monetary Economics',
    },
    {
      prerequisite: 'Discrete Mathematics',
      postrequisite: 'Logic for Computer Science Students',
      type: 'soft',
    },
    {
      prerequisite: 'Introduction to Computer Science and Java',
      postrequisite: 'Computer Organization',
    },
  ];

  for (const prereq of prerequisites) {
    const prereqCourse =
      createdCourses[prereq.prerequisite] ||
      (await tx.course.findFirst({
        where: {
          name: {
            en_text: prereq.prerequisite,
          },
        },
      }));

    const postreqCourse =
      createdCourses[prereq.postrequisite] ||
      (await tx.course.findFirst({
        where: {
          name: {
            en_text: prereq.postrequisite,
          },
        },
      }));

    if (prereqCourse && postreqCourse) {
      // Check if relationship already exists
      const existingRelationship = await tx.blockRelationship.findFirst({
        where: {
          prerequisiteId: prereqCourse.blockId,
          postrequisiteId: postreqCourse.blockId,
        },
      });

      if (!existingRelationship) {
        // Use upsert to handle potential ID conflicts
        const relationshipId =
          ADDITIONAL_RELATIONSHIP_IDS[relationshipIdIndex++];
        const blockRelationship = await tx.blockRelationship.upsert({
          where: { id: relationshipId },
          update: {},
          create: {
            id: relationshipId,
            prerequisiteId: prereqCourse.blockId,
            postrequisiteId: postreqCourse.blockId,
          },
        });

        // Check if metadata already exists for this relationship
        const existingMetadata = await tx.relationshipMetadata.findFirst({
          where: {
            blockRelationshipId: blockRelationship.id,
            key: 'TYPE',
          },
        });

        if (!existingMetadata) {
          await tx.relationshipMetadata.create({
            data: {
              id: METADATA_IDS[metadataIdIndex++],
              blockRelationshipId: blockRelationship.id,
              key: 'TYPE',
              value: prereq.type || 'hard',
            },
          });
        }
      }
    }
  }

  console.log('Additional courses and relationships seeded successfully.');
};
