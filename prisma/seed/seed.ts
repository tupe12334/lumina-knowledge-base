import { Prisma, PrismaClient } from 'generated/client';
import { seedColmanCourses } from './colman.courses.seed';
import { seedComputerScienceDegree } from './computer-science-degree.seed';
import { seedComputerScienceCourses } from './computer-science.seed';
import { courses } from './courses.consts';
import { seedDegrees } from './degree.seed';
import { seedDisciplines } from './disciplines.seed';
import { seedEconomicsDegree } from './economics-degree.seed';
import { seedFaculties } from './faculties.seed';
import { seedModules } from './modules.seed';
import { seedPhysicsModulesAndQuestions } from './physics-modules-questions.seed';
import { seedQuestions } from './questions.seed';
import { seedBlockConnections } from './block-connections.seed';
import { BLOCK_CONNECTIONS } from './block-connections.consts';
import {
  THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
  THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
} from './universities.consts';
import { seedUniversities } from './universities.seed';
import { SeedCache } from './cache';

const createBlocksForComputerScienceCourses = async (
  tx: Prisma.TransactionClient,
) => {
  const uniqueBlockIds = [...new Set(courses.map((course) => course.blockId))];

  for (const blockId of uniqueBlockIds) {
    await tx.block.upsert({
      where: { id: blockId },
      update: {},
      create: {
        id: blockId,
      },
    });
  }
  console.log(
    `Created ${uniqueBlockIds.length} blocks for computer science courses.`,
  );
};

export const seed = async (prisma: PrismaClient) => {
  const cache = new SeedCache()
  await prisma.$transaction(
    async (tx) => {
      console.log(`Seeding database...`);

      const translations = [
        // University Translations
        {
          id: 'fa6eb564-ad2c-480c-9086-82a4fd474b0a',
          en_text: THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
          he_text: 'האוניברסיטה הפתוחה',
        },
        {
          id: 'b4dad9c8-73fc-4da4-96c8-9586d1134663',
          en_text: THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
          he_text: 'המכללה למנהל',
        },
        {
          id: 'fb5130e5-42f0-4e95-8fd7-6ec892ea3dd5',
          en_text: 'Ben-Gurion University of the Negev',
          he_text: 'אוניברסיטת בן-גוריון בנגב',
        },

        // Discipline Translations
        {
          id: 'e8b9f640-68b9-4d90-a56b-9ab8dfade0af',
          en_text: 'Mathematics',
          he_text: 'מתמטיקה',
        },
        {
          id: '24b5a671-ea76-4c9b-8fd2-97e09f958f39',
          en_text: 'Physics',
          he_text: 'פיזיקה',
        },
        {
          id: 'dd8d69f7-9959-43a2-a227-233d003fb709',
          en_text: 'Chemistry',
          he_text: 'כימיה',
        },
        {
          id: 'c2471542-a206-4e5d-9bc5-7b5fd76f2c70',
          en_text: 'Biology',
          he_text: 'ביולוגיה',
        },
        {
          id: '5b51d5e2-608f-4ceb-8184-efc63ce643cd',
          en_text: 'Economics',
          he_text: 'כלכלה',
        },
        {
          id: 'ee53adf0-406c-43bc-9710-3a96cdcfb4c0',
          en_text: 'Psychology',
          he_text: 'פסיכולוגיה',
        },
        {
          id: '63e95b0b-85de-4c54-b6af-face80091bb4',
          en_text: 'Computer Science',
          he_text: 'מדעי המחשב',
        },
        {
          id: '6dc8759c-5eff-4b8e-bc7e-6476ed60ba3f',
          en_text: 'Statistics',
          he_text: 'סטטיסטיקה',
        },
        {
          id: 'f0c2636f-08a8-4529-a37a-6206d7e1772a',
          en_text: 'Cognitive Science',
          he_text: 'מדעי הקוגניציה',
        },

        // Faculty Translations
        {
          id: '067fc944-3d78-4675-a759-804e22b179a9',
          en_text: 'Social Sciences',
          he_text: 'מדעי החברה',
        },
        {
          id: 'ca18e408-bc40-4f5c-8460-9be7bad1e78c',
          en_text: 'Exact Sciences',
          he_text: 'מדעים מדויקים',
        },

        {
          id: '369f5ce8-05f1-4d30-820e-baeb8bfb4e93',
          en_text: 'Engineering',
          he_text: 'הנדסה',
        },
        {
          id: '1b1daa8c-4cc3-4715-b876-908c29dba6a4',
          en_text: 'Arts',
          he_text: 'אמנויות',
        },

        // Module Translations
        {
          id: '21d803d9-2816-4a0b-a1b4-deafc757ca7b',
          en_text: 'SI System',
          he_text: 'מערכת היחידות הבין לאומיות',
        },
        {
          id: '66a766a9-3dd6-4882-aa66-cc197baf0d75',
          en_text: 'Basic Units',
          he_text: 'יחידות בסיסיות',
        },
        {
          id: '71855b2c-5fb3-4adb-8b0a-25f7b3c9d75b',
          en_text: 'Derived Units',
          he_text: 'יחידות נגזרות',
        },
        {
          id: '7a2defc6-8d92-4547-bf19-520c79cf2c7d',
          en_text: 'One Dimensional Kinematics',
          he_text: 'קינמטיקה חד ממדית',
        },
        {
          id: '06e659ed-d128-4701-8e36-29a76e45439b',
          en_text: 'Average Velocity',
          he_text: 'מהירות ממוצעת',
        },
        {
          id: 'bbf5d5d5-f6da-48f8-addc-e5fc6fda3e22',
          en_text: 'Instantaneous Velocity',
          he_text: 'מהירות רגעית',
        },
        {
          id: 'd6a6d4dc-56c9-479d-8477-0b49dd5d19d7',
          en_text: 'Two Dimensional Graph Reading',
          he_text: 'קריאת גרפים דו ממדית',
        },

        // Additional Module Translations
        {
          id: '93924e0d-75b4-4ce6-9685-272717eb813a',
          en_text: 'Number Systems',
          he_text: 'מערכות מספרים',
        },
        {
          id: 'c3f0f380-14e4-4a4f-acc8-2e6e8174d929',
          en_text: 'Propositional Logic',
          he_text: 'תחשיב הפסוקים',
        },
        {
          id: 'fe2ca514-efb5-416e-ae84-ea6f8abfbbc3',
          en_text: 'First-order Logic',
          he_text: 'שפה מסדר ראשון',
        },
        {
          id: '3d7cda6d-f861-425f-b26b-b946d1b6d6cc',
          en_text: 'Cartesian Coordinate System',
          he_text: 'מערכת צירים קרטזית',
        },
        {
          id: '1125b34d-08d7-427d-ac09-9bc662fb6f4e',
          en_text: 'Interval',
          he_text: 'קטעים',
        },
        {
          id: '88127e0b-b188-43b8-9ab4-e5a20fc801c6',
          en_text: 'Absolute Value',
          he_text: 'ערך מוחלט',
        },
        {
          id: '3d0c1164-d8fb-46b0-ac93-ec4a6a28ad70',
          en_text: 'Properties of the Absolute Value',
          he_text: 'תכונות הערך המוחלט',
        },
        {
          id: '30c0f737-78bf-4b62-8ecd-5e7b1ea0074d',
          en_text: 'How to Formalize',
          he_text: 'איך להצרין',
        },
        {
          id: 'bcb13a75-482b-4283-a01f-084abf2d5566',
          en_text: 'Rules of Inference',
          he_text: 'כללי היסק',
        },
        {
          id: '0e3f282b-ff36-4beb-af8b-a7be8efe14c9',
          en_text: 'Structural Induction',
          he_text: 'אינדוקציה מבנית',
        },
        {
          id: 'c5c99931-3520-4a2a-a19a-4ae15c0416a0',
          en_text: 'Reading Rules of Inference',
          he_text: 'קריאת כללי היסק',
        },
        {
          id: '7d8c9e06-4c21-492e-8456-34ca44d54239',
          en_text: 'Proof Theory',
          he_text: 'תורת ההוכחה',
        },
        {
          id: '301942a6-6fb4-436f-b7fa-cbccbe60235a',
          en_text: 'Quantifiers (∀, ∃)',
          he_text: 'כמתים (∀, ∃)',
        },
        {
          id: '93d0e96c-f2ae-4120-87f9-5392f5911f85',
          en_text:
            'Quantifiers (∀, ∃) and their effect on formula complexity (rank/degree)',
          he_text: 'כמתים (∀, ∃) והשפעתם על מורכבות נוסחאות (דרגה/רנק)',
        },
        {
          id: '1c66ed81-b549-40b4-9b90-567da80eaf42',
          en_text: 'Prenex Normal Form',
          he_text: 'צורה פרנקסית נורמלית',
        },
        {
          id: '4fccd7ce-a577-4112-bcf0-9a457db4ea67',
          en_text: 'Set Theory',
          he_text: 'תורת הקבוצות',
        },
        {
          id: '58311395-1c6c-4245-9f4e-d84cf5ab3aad',
          en_text: 'Modus Ponens',
          he_text: 'מודוס פוננס',
        },
        {
          id: '0c1b4d29-52ce-48d6-9081-c509ce1803fb',
          en_text: 'Modus Tollens',
          he_text: 'מודוס טולנס',
        },
        {
          id: 'd3433e9d-7bd2-4cd3-b5fa-2e7106359d8a',
          en_text: 'Hilbert System',
          he_text: 'תחשיב הילברט',
        },
        {
          id: 'afd3da10-9427-4c78-a3a6-1d4b7ee801a5',
          en_text: 'Soundness and Completeness',
          he_text: 'תקפות ושלמות',
        },
        {
          id: 'fe759279-2e38-4cc2-ba66-fedb147c6e3d',
          en_text: 'Truth Tables',
          he_text: 'טבלאות אמת',
        },
        {
          id: '4927db38-bcb9-4658-84a8-c0f74b61c399',
          en_text: 'Consistency and Satisfiability of Sets of Propositions',
          he_text: 'עקביות וספיקות של קבוצות פסוקים',
        },
        {
          id: '5f580686-9cf6-492a-b23a-267646c3788d',
          en_text: 'Axioms',
          he_text: 'אקסיומות',
        },
        {
          id: 'e5a9ecea-2a60-46ff-93c5-a7882ee287ab',
          en_text: 'Logic Satisfiability & Consistency',
          he_text: 'ספיקות ועקביות לוגית',
        },
        {
          id: 'ca479118-7a80-47d4-939b-47f652fb6f2f',
          en_text: 'Semantics',
          he_text: 'סמנטיקה',
        },
        {
          id: '3d63669a-d904-4918-8782-6922f19a202b',
          en_text: 'Convergent Subsequences',
          he_text: 'סדרת הוכחה',
        },
      ];

      for (const translation of translations) {
        const existingTranslation = await tx.translation.findFirst({
          where: { en_text: translation.en_text },
        });

        if (existingTranslation) {
          await tx.translation.update({
            where: { id: existingTranslation.id },
            data: { he_text: translation.he_text },
          });
        } else {
          await tx.translation.create({
            data: {
              id: translation.id,
              en_text: translation.en_text,
              he_text: translation.he_text,
            },
          });
        }
      }

      console.log(`Translations seeded successfully.`);

      await seedUniversities(tx, cache);
      await seedFaculties(tx, cache);
      await seedDisciplines(tx, cache);
      await seedColmanCourses(tx, cache);

      // Create blocks for computer science courses before creating the courses
      console.log(`Creating blocks for computer science courses...`);
      await createBlocksForComputerScienceCourses(tx);

      await seedComputerScienceCourses(tx, cache);
      await seedDegrees(tx, cache);
      await seedComputerScienceDegree(tx, cache);
      await seedEconomicsDegree(tx, cache);
      await seedModules(tx, cache);
      await seedQuestions(tx);
      await seedPhysicsModulesAndQuestions(tx, cache);
      await seedBlockConnections(tx, BLOCK_CONNECTIONS);
    },
    { timeout: 100000 },
  );
  await prisma.$disconnect();
};

if (require.main === module) {
  void (async () => {
    const { PrismaClient } = await import('../../generated/client');
    const prisma = new PrismaClient();
    void (await seed(prisma));
    void prisma.$disconnect();
  })();
}
