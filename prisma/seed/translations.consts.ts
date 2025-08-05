/**
 * Translation constants for database seeding
 * Extracted from seed.ts for better organization and performance optimization
 *
 * IMPORTANT: This file contains ALL translations used in seeding to enable
 * bulk operations instead of individual upserts for optimal performance.
 */

import {
  THE_COLLEGE_OF_MANAGEMENT_ACADEMIC_STUDIES_EN_NAME,
  THE_OPEN_UNIVERSITY_OF_ISRAEL_EN_NAME,
} from './universities.consts';

export interface TranslationSeed {
  id: string;
  en_text: string;
  he_text: string;
}

export const TRANSLATIONS: TranslationSeed[] = [
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

  // Module Translations (original ones from previous file)
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

  // ALL EXTRACTED TRANSLATIONS FROM SEED FILES
  // courses.consts.ts
  {
    id: '8b9cde61-4a1d-4e8d-800b-f41449623a07',
    en_text: 'Data Mining',
    he_text: 'כריית נתונים',
  },
  // courses.consts.ts
  {
    id: '33040305-1b03-4b94-b168-c1c2b07170a4',
    en_text: 'Defensive Systems Programming',
    he_text: 'תכנות מערכות הגנתיות',
  },
  // courses.consts.ts
  {
    id: '851db662-4933-444c-9a54-a5795074a8a4',
    en_text: 'Computer Graphics',
    he_text: 'גרפיקה ממוחשבת',
  },
  // courses.consts.ts
  {
    id: '4b42c9f4-436a-4008-9291-5ca24df618fe',
    en_text: 'Discrete Mathematics',
    he_text: 'מתמטיקה בדידה',
  },
  // courses.consts.ts
  {
    id: 'be355b4a-6a11-49b9-ac5b-c3b66d52212b',
    en_text: 'Logic for Computer Science Students',
    he_text: 'לוגיקה לסטודנטים למדעי המחשב',
  },
  // courses.consts.ts
  {
    id: '6b3dd279-082e-47d6-a5cf-e795d5f07986',
    en_text: 'Auctions and Electronic Markets: Mechanism Design and Algorithms',
    he_text: 'מכרזים ושוקיים אלקטרוניים: תכנון מכניזמים ואלגוריתמים',
  },
  // courses.consts.ts
  {
    id: 'fb83c421-6e77-4571-9640-f0865e4c0ce9',
    en_text: 'Calculus A',
    he_text: 'חדו״א א',
  },
  // courses.consts.ts
  {
    id: 'C44DBE0A-CFF5-4259-9064-163E3ED72F32',
    en_text: 'Calculus B',
    he_text: 'חדו״א ב',
  },
  // courses.consts.ts
  {
    id: 'd191be2f-56ed-4cf6-880b-18c749786af9',
    en_text: 'Database Systems',
    he_text: 'מערכות בסיסי נתונים',
  },
  // courses.consts.ts
  {
    id: 'e6a95799-ced3-42d4-9e48-8bf68553044a',
    en_text: 'Introduction to Java',
    he_text: 'מבוא לשפת Java',
  },
  // courses.consts.ts
  {
    id: 'c7e930db-5b2a-43ba-a6e9-567bf5883053',
    en_text: 'Introduction to Psychology',
    he_text: 'מבוא לפסיכולוגיה',
  },
  // courses.consts.ts
  {
    id: '45268d5a-6c0d-4760-ab4f-828be0a86d88',
    en_text: 'Introduction to Microeconomics',
    he_text: 'מבוא למיקרוכלכלה',
  },
  // courses.consts.ts
  {
    id: 'd3b11a88-d9c2-4397-b6e4-2d2b0976a83a',
    en_text: 'Basic Concepts in Econometrics',
    he_text: 'מושגי יסוד באקונומטריקה',
  },
  // courses.consts.ts
  {
    id: 'ef61ce16-2b50-4316-91dd-16913271687b',
    en_text: 'Chapters in Physical Chemistry',
    he_text: 'פרקים בכימיה פיסיקלית',
  },
  // courses.consts.ts
  {
    id: '2d97a756-9661-4ff2-929f-66a368b704cc',
    en_text: 'Complementary Integral Calculus',
    he_text: 'השלמות בחשבון אינטגרלי',
  },
  // courses.consts.ts
  {
    id: 'f7e34ceb-36a4-4321-bf3f-be4b967a8f84',
    en_text: 'Computer Organization',
    he_text: 'ארגון המחשב',
  },
  // courses.consts.ts
  {
    id: '18dee43c-2d42-4740-8fcd-700038824deb',
    en_text: 'Differential Calculus for Economics and Management Students',
    he_text: 'חשבון דיפרנציאלי לתלמידי כלכלה וניהול',
  },
  // courses.consts.ts
  {
    id: 'bcb61756-0297-4deb-a66f-d182600e0179',
    en_text: 'Ecology',
    he_text: 'אקולוגיה',
  },
  // courses.consts.ts
  {
    id: '1c48257b-684a-4ccb-89c5-78e344de5c4a',
    en_text: 'Electricity and Magnetism',
    he_text: 'חשמל ומגנטיות',
  },
  // courses.consts.ts
  {
    id: 'd0498c23-075c-4a53-8093-66b8982f940f',
    en_text: 'Foundations of Physics A',
    he_text: 'יסודות הפיסיקה א',
  },
  // courses.consts.ts
  {
    id: 'f4bd0465-66ed-4a94-9021-e37700974c03',
    en_text: 'Foundations of Physics B',
    he_text: 'יסודות הפיסיקה ב',
  },
  // courses.consts.ts
  {
    id: '76223a65-8be7-4d0b-8f7f-76591882255f',
    en_text: 'Foundations of Physics for Biologists A',
    he_text: 'יסודות הפיסיקה לביולוגים א',
  },
  // courses.consts.ts
  {
    id: '33debec6-42c7-4984-a19a-04ab6ad88272',
    en_text: 'General Biology A',
    he_text: 'ביולוגיה כללית א',
  },
  // courses.consts.ts
  {
    id: 'e1b58f24-a1f7-4ccc-b09b-2e95ab840f57',
    en_text: 'General Biology B',
    he_text: 'ביולוגיה כללית ב',
  },
  // courses.consts.ts
  {
    id: '188799c1-cb5f-4908-9f74-474f5fa96d36',
    en_text: 'General Chemistry',
    he_text: 'כימיה כללית',
  },
  // courses.consts.ts
  {
    id: '66ababae-045e-4406-b616-00f44e8acd21',
    en_text: 'General Chemistry A',
    he_text: 'כימיה כללית א',
  },
  // courses.consts.ts
  {
    id: '9b00bf4a-1b10-48d7-bead-19a202108e8b',
    en_text: 'General Chemistry B',
    he_text: 'כימיה כללית ב',
  },
  // courses.consts.ts
  {
    id: '43f262a6-2545-43fb-8a5d-90d69072fddf',
    en_text: 'Infinitesimal Calculus 1',
    he_text: 'חשבון אינפיניטסימלי 1',
  },
  // courses.consts.ts
  {
    id: '29fff600-3511-4311-bc67-c7f61504513a',
    en_text: 'Introduction to Macroeconomics',
    he_text: 'מבוא למקרוכלכלה',
  },
  // courses.consts.ts
  {
    id: 'd82fe5b4-1676-41e3-ace2-6b0ee92a1833',
    en_text: 'Introduction to Statistics for Social Sciences A',
    he_text: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה א',
  },
  // courses.consts.ts
  {
    id: '3292ae0f-3ba5-4526-99a8-10e7aa6238b0',
    en_text: 'Labor Economics',
    he_text: 'כלכלת עבודה',
  },
  // courses.consts.ts
  {
    id: '37771716-f5eb-444c-942d-901751914f80',
    en_text: 'Probability and Introduction to Statistics for Computer Science',
    he_text: 'הסתברות ומבוא לסטטיסטיקה למדעי המחשב',
  },
  // courses.consts.ts
  {
    id: '40e51728-2ccd-47bb-bc71-6d39499ed577',
    en_text: 'Foundations of Physics for Biologists B',
    he_text: 'יסודות הפיסיקה לביולוגים ב',
  },
  // courses.consts.ts
  {
    id: '7c9224fb-793d-48c1-8475-1285ed9da02d',
    en_text: 'General Chemistry for Biologists B',
    he_text: 'כימיה כללית לביולוגים ב',
  },
  // courses.consts.ts
  {
    id: '43fb0be2-16ac-4052-a44f-689d4af82440',
    en_text: 'Infinitesimal Calculus 2',
    he_text: 'חשבון אינפיניטסימלי 2',
  },
  // courses.consts.ts
  {
    id: '11d4ed91-e7d3-4eb5-ae96-5933d7de4951',
    en_text: 'Infinitesimal Calculus 3',
    he_text: 'חשבון אינפיניטסימלי 3',
  },
  // courses.consts.ts
  {
    id: '9ccbc3cc-2abf-4120-9377-f5a8beaaa10c',
    en_text: 'Intergenerational Economics',
    he_text: 'כלכלה בין-דורית',
  },
  // courses.consts.ts
  {
    id: '818a894b-ef5a-4ef6-8f6c-363e8eae93fb',
    en_text: 'International Real Economics',
    he_text: 'כלכלה בין-לאומית ריאלית',
  },
  // courses.consts.ts
  {
    id: '0f9fce5f-6089-4661-93cc-72e6aa2e57cd',
    en_text: 'Computational Models',
    he_text: 'מודלים חישוביים',
  },
  // courses.consts.ts
  {
    id: '72f86c11-f987-48fd-975a-6627b0019940',
    en_text: 'Algorithms',
    he_text: 'אלגוריתמים',
  },
  // courses.consts.ts
  {
    id: 'd4c501df-eb02-4125-9f97-573813b664fb',
    en_text: 'Thermodynamics for Physicists',
    he_text: 'תרמודינמיקה לפיזיקאים',
  },
  // courses.consts.ts
  {
    id: '5b076629-77e3-41b1-b18b-b1ddef2cb6ef',
    en_text: 'Introduction to Statistics for Social Sciences B',
    he_text: 'מבוא לסטטיסטיקה לתלמידי מדעי החברה ב',
  },
  // courses.consts.ts
  {
    id: '8d81b8f4-b107-4ecd-9584-d7f8c9f26be7',
    en_text: 'Introduction to Computer Science and Java',
    he_text: 'מבוא למדעי המחשב ושפת Java',
  },
  // courses.consts.ts
  {
    id: '22a25557-6bef-4097-81a4-3b71bd84efb9',
    en_text: 'Introduction to Differential Equations',
    he_text: 'מבוא למשוואות דיפרנציאליות',
  },
  // courses.consts.ts
  {
    id: 'cad57e56-af9a-4bd8-b849-94bdbaf5efca',
    en_text: 'Introduction to Statistics and Probability for Science Students',
    he_text: 'מבוא לסטטיסטיקה ולהסתברות לתלמידי מדעים',
  },
  // courses.consts.ts
  {
    id: 'f0ae6d1b-c1c6-4d2f-ba0d-5eade0cb623b',
    en_text: 'Linear Algebra 1',
    he_text: 'אלגברה ליניארית 1',
  },
  // courses.consts.ts
  {
    id: '68453935-7832-405a-b42a-e41d10099093',
    en_text: 'Linear Algebra 2',
    he_text: 'אלגברה ליניארית 2',
  },
  // courses.consts.ts
  {
    id: 'f25c3425-8a0b-4d9d-baea-fb78fc675490',
    en_text: 'Linear Algebra for Science',
    he_text: 'אלגברה לינארית למדעים',
  },
  // courses.consts.ts
  {
    id: '2bd06a32-de31-423e-be91-cd72dbab4cb8',
    en_text: 'Macroeconomics A',
    he_text: 'מקרו כלכלה א',
  },
  // courses.consts.ts
  {
    id: '2befe762-2d92-40b2-a970-83f9a08db26e',
    en_text: 'Macroeconomics B',
    he_text: 'מקרו כלכלה ב',
  },
  // courses.consts.ts
  {
    id: '56467e4f-9a52-4a30-9e83-8e69f88be7ea',
    en_text: 'Mechanics',
    he_text: 'מכניקה',
  },
  // courses.consts.ts
  {
    id: '3682e794-c6db-48af-9086-8bcdf3ba1361',
    en_text: 'Microeconomics A',
    he_text: 'מיקרו כלכלה א',
  },
  // courses.consts.ts
  {
    id: '42b0726e-77ec-49e8-96a3-1081de8ed902',
    en_text: 'Microeconomics B',
    he_text: 'מיקרו כלכלה ב',
  },
  // courses.consts.ts
  {
    id: '4ee3dc1d-68c8-4d49-8de5-d68b44dbf30d',
    en_text: 'Microeconomics C',
    he_text: 'מיקרו כלכלה ג',
  },
  // courses.consts.ts
  {
    id: '7a1911a3-4472-4823-b0a4-ec9acede05c3',
    en_text: 'Monetary Economics',
    he_text: 'כלכלת כספים',
  },
  // courses.consts.ts
  {
    id: '90b094e5-7008-4d15-8760-4e5a0004e833',
    en_text: 'Organic Chemistry',
    he_text: 'כימיה אורגנית',
  },
  // courses.consts.ts
  {
    id: '6086c503-3b98-40e1-a628-10f08a49cc7a',
    en_text: 'Organic Chemistry for Biologists',
    he_text: 'כימיה אורגנית לביולוגים',
  },
  // courses.consts.ts
  {
    id: '06ab4809-b5a7-4a63-bf64-11b2137e158c',
    en_text: 'Political Economy',
    he_text: 'כלכלה פוליטית',
  },
  // courses.consts.ts
  {
    id: '43c27b29-25c0-48bd-b464-9a89b0fbbaaf',
    en_text: 'Public Economics',
    he_text: 'כלכלת ציבור',
  },
  // courses.consts.ts
  {
    id: 'e29d162e-1a63-4875-b34c-67349bcdfb33',
    en_text: 'Semiconductor Devices',
    he_text: 'התקני מוליכים למחצה',
  },
  // courses.consts.ts
  {
    id: 'e45aa0ec-3d93-402d-be14-83c7e35bfed6',
    en_text: 'Semiconductors',
    he_text: 'מוליכים למחצה',
  },
  // courses.consts.ts
  {
    id: '85c94e9d-d658-47e1-8792-649c597b4d2a',
    en_text: 'Social Preference and Choice',
    he_text: 'העדפה חברתית ובחירה',
  },
  // courses.consts.ts
  {
    id: '0fca4bf4-a204-4cc8-9911-8485516ff5a0',
    en_text:
      'Strategic Thinking: Game Theory and its Applications in Economics and Management',
    he_text: 'חשיבה אסטרטגית: תורת המשחקים ויישומיה בכלכלה ובניהול',
  },
  // courses.consts.ts
  {
    id: 'e3bf3cfa-6ce6-4c18-8acc-112cbfe2ec65',
    en_text: 'System Programming Laboratory',
    he_text: 'מעבדת תכנות מערכות',
  },
  // courses.consts.ts
  {
    id: '474a614d-806d-4b79-8430-6242b799b7f6',
    en_text: 'The Economics of Israel',
    he_text: 'כלכלת ישראל',
  },
  // courses.consts.ts
  {
    id: '37874beb-e35c-4a13-bb04-51eac3fa3b65',
    en_text: 'Thermodynamics',
    he_text: 'תרמודינמיקה',
  },
  // courses.consts.ts
  {
    id: '6316c2a7-f4e8-4e32-8fb5-e0e2611bde66',
    en_text: 'Topics in Mathematics for Social Sciences Students',
    he_text: 'נושאים במתמטיקה לסטודנטים למדעי החברה',
  },
  // courses.consts.ts
  {
    id: '529780e7-32c7-4685-b54d-df934d032de6',
    en_text: 'Statistical Inference',
    he_text: 'הסקה סטטיסטית',
  },
  // courses.consts.ts
  {
    id: '47191873-af34-406e-b66b-8f90c065057e',
    en_text: 'Data Structures and Introduction to Algorithms',
    he_text: 'מבני נתונים ומבוא לאלגוריתמים',
  },
  // courses.consts.ts
  {
    id: 'b5b8e1fb-02be-4c0f-b0dd-d0cf037f887c',
    en_text: 'Artificial Intelligence',
    he_text: 'בינה מלכותית',
  },

  {
    id: '58503f66-af42-4992-bdc1-79fc62c4a61f',
    en_text:
      'How to formalize the statement: "The square of every real number different from zero is greater than zero"',
    he_text:
      'איך לפרמל את הפסוק: "הריבוע של כל מספר ממשי ששונה מאפס הוא גדול מאפס"',
  },

  {
    id: '7ac8c2ed-1b4f-4e7a-9d5e-8f3b2c4a1e6d',
    en_text: '∀x ∈ ℝ, x ≠ 0 → x² > 0',
    he_text: '∀x ∈ ℝ, x ≠ 0 → x² > 0',
  },

  {
    id: '9e2f4a1c-3d5e-4b7f-8a9d-1c2e3f4a5b6c',
    en_text: '∃x ∈ ℝ, x ≠ 0 ∧ x² > 0',
    he_text: '∃x ∈ ℝ, x ≠ 0 ∧ x² > 0',
  },

  {
    id: '1f3e5a7c-4b6d-4e8f-9a1c-2d3e4f5a6b7c',
    en_text: '∀x ∈ ℝ, x² > 0 → x ≠ 0',
    he_text: '∀x ∈ ℝ, x² > 0 → x ≠ 0',
  },

  {
    id: '2a4c6e8f-5b7d-4f9a-8c1e-3d4e5f6a7b8c',
    en_text: '∀x ∈ ℝ, x ≠ 0 ∧ x² > 0',
    he_text: '∀x ∈ ℝ, x ≠ 0 ∧ x² > 0',
  },

  {
    id: '3b5d7f9a-6c8e-4a1c-9d2e-4e5f6a7b8c9d',
    en_text: '∃x ∈ ℝ, x ≠ 0 → x² > 0',
    he_text: '∃x ∈ ℝ, x ≠ 0 → x² > 0',
  },

  {
    id: '4c6e8a1c-7d9f-4b2d-8e1f-5f6a7b8c9d1e',
    en_text: '∀x ∈ ℝ, x² > 0 ∧ x ≠ 0',
    he_text: '∀x ∈ ℝ, x² > 0 ∧ x ≠ 0',
  },

  {
    id: '5d7f9b2e-8e1a-4c3e-9f2a-6a7b8c9d1e2f',
    en_text: '∀x ∈ ℝ, x = 0 → x² > 0',
    he_text: '∀x ∈ ℝ, x = 0 → x² > 0',
  },

  {
    id: '6e8a1c3f-9f2b-4d4f-8a3b-7b8c9d1e2f3a',
    en_text: '∃x ∈ ℝ, x² > 0 ∧ x ≠ 0',
    he_text: '∃x ∈ ℝ, x² > 0 ∧ x ≠ 0',
  },

  {
    id: 'd39c0ad3-92d1-4290-b604-0033444b6f03',
    en_text:
      'About a real number x, the statement "The square of any real number that is not zero is positive" can be expressed as',
    he_text:
      'על מספר ממשי x, הפסוק "הריבוע של כל מספר ממשי שאינו אפס הוא חיובי" יכול להיות מבוטא כ',
  },

  {
    id: '8f9a1b2c-4d5e-4f6a-9b8c-7d8e9f1a2b3c',
    en_text: '∀x((x ≠ 0) ∧ (x² > 0))',
    he_text: '∀x((x ≠ 0) ∧ (x² > 0))',
  },

  {
    id: '9a1c2d3e-5f6a-4b7c-8d9e-8e9f1a2b3c4d',
    en_text: '∀x((x² ≤ 0) → (x = 0))',
    he_text: '∀x((x² ≤ 0) → (x = 0))',
  },

  {
    id: '1b2d3f4a-6c7e-4d8f-9a1b-9f1a2b3c4d5e',
    en_text: '∀x((x > 0) ∨ (x < 0) ∨ (x² > 0))',
    he_text: '∀x((x > 0) ∨ (x < 0) ∨ (x² > 0))',
  },

  {
    id: '338bee00-49e8-47f1-afd7-ab19015bdf2a',
    en_text: 'All previous statements are equivalent',
    he_text: 'כל ההצהרות הקודמות שוות',
  },

  {
    id: 'b0500946-9885-4afa-b80d-72969aefbe82',
    en_text:
      'In this question open intervals refer to (a,b) meaning a < b. Given an infinite and bounded set A of real numbers',
    he_text:
      'בשאלה זו רווחים פתוחים מתייחסים ל-(a,b) כלומר a < b. בהינתן קבוצה אינסופית וחסומה A של מספרים ממשיים',
  },

  {
    id: 'd18996b8-4006-460d-a20c-720e7f830eb1',
    en_text:
      'There exists a small open interval (a,b) such that A ∩ (a,b) = ℵ₀',
    he_text: 'קיים רווח פתוח קטן (a,b) כך ש A ∩ (a,b) = ℵ₀',
  },

  {
    id: '85854db4-bde9-4adf-b574-20fb84bd9d8e',
    en_text:
      'There exists a small open interval (a,b) such that A ∩ (a,b) ≠ ℵ₀',
    he_text: 'קיים רווח פתוח קטן (a,b) כך ש A ∩ (a,b) ≠ ℵ₀',
  },

  {
    id: 'ed575596-a4f8-4dad-a044-1cd48d755c80',
    en_text:
      'There exists a small open interval (a,b) such that (ℝ \\ A) ∩ (a,b) = ℵ₀',
    he_text: 'קיים רווח פתוח קטן (a,b) כך ש (ℝ \\ A) ∩ (a,b) = ℵ₀',
  },

  {
    id: 'ec50e39c-ef19-4e91-8f5a-7ed39f14f334',
    en_text: 'If G is a directed graph with 6 vertices, then',
    he_text: 'אם G הוא גרף מכוון עם 6 קודקודים, אז',
  },

  {
    id: 'e625868b-df75-4b35-ba75-50c73a5759ef',
    en_text: 'G is not planar',
    he_text: 'G אינו מישורי',
  },

  {
    id: '8e8e35ce-8ff5-442d-803f-c3086f0abc74',
    en_text: 'G is not Hamiltonian',
    he_text: 'G אינו המילטוני',
  },

  {
    id: '9d1f2c3d-5e6f-4a7b-8c9d-8b9c1d2e3f4a',
    en_text: 'Either G is planar or G is Eulerian',
    he_text: 'או ש-G מישורי או ש-G אוילריאני',
  },

  {
    id: 'ca3b16e0-f0f9-4fc3-b9d8-e14590eb2d8e',
    en_text:
      'Given a vertex set V = {1,2,3,4,5,6,7,8} and edge series (6,7,8,1,1,1), where G is the simple graph obtained by adding edges between pairs of vertices in T (and possibly other edges)',
    he_text:
      'בהינתן קבוצת קודקודים V = {1,2,3,4,5,6,7,8} וסדרת קשתות (6,7,8,1,1,1), כאשר G הוא הגרף הפשוט המתקבל על ידי הוספת קשתות בין זוגות קודקודים ב-T (ואולי קשתות אחרות)',
  },

  {
    id: 'c0b633ef-31cd-4ebf-b389-61970605931e',
    en_text: 'Whether G is an Euler graph',
    he_text: 'האם G הוא גרף אוילריאני',
  },

  {
    id: '49b5c46b-89cf-4e3a-888d-df23b817f557',
    en_text: 'Finding the number of vertices of G (with explanation)',
    he_text: 'מציאת מספר הקודקודים של G (עם הסבר)',
  },

  {
    id: 'ba098000-4b8e-488c-bafb-0416198ab5ca',
    en_text:
      'Distribute 4 balls of type A, 4 balls of type B, 4 balls of type C, and 4 balls of type D into 4 different cells. (Balls of the same type are considered identical).',
    he_text:
      'מפזרים 4 כדורים מסוג A, 4 כדורים מסוג B, 4 כדורים מסוג C ו־4 כדורים מסוג D ב־4 תאים שונים. (כדורים מאותו סוג נחשבים זהים).',
  },

  {
    id: '00703a76-5fca-4f2f-82b2-5afd86fd0283',
    en_text: 'Calculate the number of all possible distributions.',
    he_text: 'חשבו את מספר כל הפיזורים האפשריים.',
  },

  {
    id: '57975cc8-efa9-4174-ac5e-fd003913c63d',
    en_text:
      'Calculate the number of distributions where no cell contains balls of all types.',
    he_text: 'חשבו את מספר הפיזורים שבהם אין תא המכיל כדורים מכל הסוגים.',
  },

  {
    id: '7750cecd-29cb-4eb1-b513-328284bf9866',
    en_text:
      'A menu offers 3 appetizers and 4 desserts. How many choices are available if you may choose one item from either category?',
    he_text:
      'במסעדה מוצעים 3 מתאבנים ו־4 קינוחים. כמה אפשרויות בחירה יש אם ניתן לבחור פריט אחד מאחת הקטגוריות?',
  },

  {
    id: 'b81240ad-ed98-4a7e-9dea-7e922e884d19',
    en_text:
      'A coffee shop sells 3 types of coffee and 4 types of pastry. How many different combinations of one coffee and one pastry can you order?',
    he_text:
      'בית קפה מוכר 3 סוגי קפה ו־4 סוגי מאפה. כמה שילובים שונים של קפה ומאפה ניתן להזמין?',
  },

  {
    id: 'f4e15a03-0822-47ca-ab99-522416a28365',
    en_text:
      'Let A and B be finite sets with |A| = 3 and |B| = 4. How many elements does A × B contain?',
    he_text:
      'נניח A ו־B הן קבוצות סופיות שמספר איבריהן הוא |A| = 3 ו־|B| = 4. כמה איברים מכילה המכפלה הקרטזית A × B?',
  },

  {
    id: 'E07E39B7-1EDE-4F5F-B988-01D92FED7BE3',
    en_text:
      'How many ways can you choose 3 students from a class of 10 students?',
    he_text: 'בכמה דרכים ניתן לבחור 3 תלמידים מתוך כיתה של 10 תלמידים?',
  },

  {
    id: '87bf2c16-3e44-4a93-b2c4-abead40c51f5',
    en_text:
      'How many ways can you choose 5 cards from a standard deck such that exactly 3 are hearts?',
    he_text:
      'בכמה דרכים ניתן לבחור 5 קלפים מחבילת קלפים רגילה כך שבדיוק 3 מתוכם יהיו לבבות?',
  },

  {
    id: '5f9313d3-6258-4fe1-87f6-21a39af92d29',
    en_text:
      'From a group of 7 men and 5 women, how many committees of 4 can be formed that contain at least 2 women?',
    he_text:
      'מתוך קבוצה של 7 גברים ו־5 נשים, כמה ועדות של 4 אפשר להרכיב שבהן יש לפחות 2 נשים?',
  },

  {
    id: '21885747-9432-4370-8901-0e0cf137297c',
    en_text:
      'How many ways can 8 identical balls be distributed into 4 distinct boxes if each box must contain at least one ball?',
    he_text:
      'בכמה דרכים ניתן לחלק 8 כדורים זהים ל־4 תיבות שונות כך שבכל תיבה יהיה לפחות כדור אחד?',
  },

  {
    id: 'f39a03e3-8807-462b-bb79-0a8f5d3afbc7',
    en_text:
      'How many non‐negative integer solutions are there to x₁ + x₂ + x₃ + x₄ = 15 if each xᵢ is at most 6?',
    he_text:
      'כמה פתרונות במספרים שלמים אי‐שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ = 15 כאשר כל xᵢ אינו עולה על 6?',
  },

  {
    id: '1631553c-3065-403d-a3aa-8e11f02c2120',
    en_text:
      'How many ways can you select 4 donuts from 6 types if repetitions are allowed?',
    he_text:
      'בכמה דרכים ניתן לבחור 4 דונאטס מתוך 6 סוגים אם מותר לבחור אותו סוג יותר מפעם אחת?',
  },

  {
    id: 'fb76aff9-70f7-42ef-9bc7-08bb69cf85e4',
    en_text:
      'How many non-negative integer solutions exist for x₁ + x₂ + x₃ = 7?',
    he_text:
      'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ = 7?',
  },

  {
    id: 'fcd1ca85-90f7-49ec-99ff-24f8cd89ec49',
    en_text:
      'How many ways can you choose 5 fruits from apples, bananas, oranges and pears if repetitions are allowed?',
    he_text:
      'בכמה דרכים ניתן לבחור 5 פירות מתוך תפוחים, בננות, תפוזים ואגסים כאשר מותר בחירה חוזרת?',
  },

  {
    id: 'd79898d6-6f3e-4611-ae25-41a96c2f706e',
    en_text:
      'In how many ways can 10 identical candies be distributed among 3 children?',
    he_text: 'בכמה דרכים ניתן לחלק 10 ממתקים זהים בין 3 ילדים?',
  },

  {
    id: 'c0ce7106-b885-4996-b313-55ab834c2dfe',
    en_text:
      'How many ways can you select 8 ice cream scoops from 5 flavors if flavors may repeat?',
    he_text:
      'בכמה דרכים ניתן לבחור 8 כדורי גלידה מתוך 5 טעמים אם ניתן לבחור טעם יותר מפעם אחת?',
  },

  {
    id: '6d7e2c23-ba10-41e4-81bd-b4d586ef924e',
    en_text:
      'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ = 6?',
    he_text:
      'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ = 6?',
  },

  {
    id: '962e9824-2aad-41eb-93f7-356629f205a3',
    en_text:
      'In how many ways can 15 identical balls be placed into 5 distinct boxes?',
    he_text: 'בכמה דרכים ניתן לשים 15 כדורים זהים ב־5 תיבות שונות?',
  },

  {
    id: '62f1128e-aa5b-440c-b989-5c8e21cc5c7a',
    en_text:
      'How many ways can you choose 7 cupcakes from 3 flavors if flavors may repeat?',
    he_text:
      'בכמה דרכים ניתן לבחור 7 קאפקייקס מתוך 3 טעמים כאשר מותר בחירה חוזרת?',
  },

  {
    id: 'a65d4ab9-cf19-449c-8aac-8086634bd4f2',
    en_text:
      'How many ways can you choose 6 candies from 4 types if repetitions are allowed?',
    he_text:
      'בכמה דרכים ניתן לבחור 6 ממתקים מתוך 4 סוגים אם מותר לבחור אותו סוג יותר מפעם אחת?',
  },

  {
    id: '23087717-eaed-4612-b5ee-43e88794c30d',
    en_text:
      'How many non-negative integer solutions exist for x₁ + x₂ + x₃ = 12?',
    he_text:
      'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ = 12?',
  },

  {
    id: 'd8f724e9-9e1f-4656-ad77-4ade25848835',
    en_text:
      'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ = 9?',
    he_text:
      'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ = 9?',
  },

  {
    id: '3f1cb82d-592e-4df9-a2bf-fcccdec55a6f',
    en_text:
      'How many ways can you choose 5 coins from 8 types if repetitions are allowed?',
    he_text:
      'בכמה דרכים ניתן לבחור 5 מטבעות מתוך 8 סוגים כאשר מותר בחירה חוזרת?',
  },

  {
    id: '48508123-6f76-4945-aa1c-1412d894f809',
    en_text:
      'In how many ways can 7 identical marbles be distributed into 2 boxes?',
    he_text: 'בכמה דרכים ניתן לחלק 7 גולות זהות לשתי תיבות?',
  },

  {
    id: 'c1c272c4-b2af-46fd-b5f8-8b291193c02b',
    en_text:
      'How many ways can you select 3 ice cream scoops from 10 flavors if flavors may repeat?',
    he_text:
      'בכמה דרכים ניתן לבחור 3 כדורי גלידה מתוך 10 טעמים כאשר מותר בחירה חוזרת?',
  },

  {
    id: '9bba34bf-e461-44be-b76f-f398155a3911',
    en_text:
      'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ + x₅ = 8?',
    he_text:
      'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ + x₅ = 8?',
  },

  {
    id: '9fe79279-2cc8-4531-b892-2c5a4daebb23',
    en_text:
      'How many ways can you choose 9 songs from 5 genres if genres may repeat?',
    he_text:
      'בכמה דרכים ניתן לבחור 9 שירים מתוך 5 סגנונות אם ניתן לבחור אותו סגנון יותר מפעם אחת?',
  },

  {
    id: '23979268-a195-4e17-b8bf-3b071c664206',
    en_text:
      'In how many ways can 11 identical pencils be distributed among 4 students?',
    he_text: 'בכמה דרכים ניתן לחלק 11 עפרונות זהים בין 4 תלמידים?',
  },

  {
    id: '913e8191-9320-4b00-8087-c77b84d16012',
    en_text:
      'How many ways can you choose 4 letters from 7 distinct letters if repetitions are allowed?',
    he_text:
      'בכמה דרכים ניתן לבחור 4 אותיות מתוך 7 אותיות שונות כאשר מותר בחירה חוזרת?',
  },

  {
    id: '32d50646-3dde-4762-961b-d1d1b15a4c1a',
    en_text:
      'How many non-negative integer solutions exist for x₁ + x₂ + x₃ + x₄ + x₅ + x₆ = 5?',
    he_text:
      'כמה פתרונות במספרים שלמים אי־שליליים קיימים למשוואה x₁ + x₂ + x₃ + x₄ + x₅ + x₆ = 5?',
  },

  {
    id: '190e3057-0c8f-4d44-a387-b216e8632ede',
    en_text:
      'How many ways can you choose 2 items from 6 types with repetition allowed?',
    he_text:
      'בכמה דרכים ניתן לבחור 2 פריטים מתוך 6 סוגים כאשר מותר בחירה חוזרת?',
  },

  {
    id: 'D9B273B8-4F71-4C1D-994F-DDA7292001BD',
    en_text:
      'In how many ways can 5 boys and 5 girls be seated in a row so that no two girls sit together?',
    he_text:
      'בכמה דרכים ניתן להושיב 5 בנים ו-5 בנות בשורה כך שאף שתי בנות לא תשבנה יחד?',
  },

  {
    id: 'd4d867eb-48cc-45f6-970a-e8d54bdb39e9',
    en_text: 'How many ways can 5 distinct objects be arranged in a row?',
    he_text: 'כמה אפשרויות לסדר 5 עצמים שונים בשורה?',
  },

  {
    id: 'eaaa76b5-0c41-44e0-8d6f-c2f03b7fe196',
    en_text:
      'How many 3-letter arrangements can be formed from A, B, C, D without repetition?',
    he_text: 'כמה סידורים בני 3 אותיות ניתן ליצור מהאותיות A,B,C,D ללא חזרה?',
  },

  {
    id: 'e272682c-6a21-4761-9309-72fad15c33b3',
    en_text: 'How many ways can 4 books be arranged on a shelf?',
    he_text: 'כמה דרכים קיימות לסדר 4 ספרים על מדף?',
  },

  {
    id: '9e876f30-59e2-4b8e-81ab-5186dc4d1211',
    en_text:
      'In how many distinct ways can 5 people sit around a circular table?',
    he_text: 'בכמה דרכים שונות יכולים 5 אנשים לשבת סביב שולחן עגול?',
  },

  {
    id: '1b406d77-ef11-4bdd-bf00-86171c667d7c',
    en_text:
      'How many 4-digit even numbers can be formed using digits 1,2,3,4 without repetition?',
    he_text:
      'כמה מספרים זוגיים בני 4 ספרות ניתן להרכיב מהספרות 1,2,3,4 ללא חזרות?',
  },

  {
    id: '07e38cca-7219-46ee-b9c0-ff5f56afd1d6',
    en_text:
      'In how many ways can 8 runners finish a race if ties are not allowed?',
    he_text: 'בכמה אופנים יכולים 8 רצים לסיים מרוץ ללא תיקו?',
  },

  {
    id: 'dde375a5-44af-433d-be3c-1c0a8aeb6570',
    en_text:
      'How many 5-digit numbers greater than 30000 can be formed using digits 1-5 without repetition?',
    he_text:
      'כמה מספרים בני 5 ספרות הגדולים מ-30000 ניתן ליצור מהספרות 1-5 ללא חזרות?',
  },

  {
    id: 'ab92366c-e66f-457a-9619-62439a063060',
    en_text: 'Is zero an even number',
    he_text: 'האם אפס הוא מספר זוגי',
  },

  {
    id: '3774b231-66e2-42b5-964b-a7ca3cffd565',
    en_text: 'What is the square root of 144',
    he_text: 'מהו השורש הריבועי של 144',
  },

  {
    id: '627d6bc0-5764-4b99-bdca-abdbacd5a82c',
    en_text: 'Describe your favorite study technique',
    he_text: 'תאר את שיטת הלמידה המועדפת עליך',
  },

  {
    id: '3eed2bf4-2068-4492-b0a1-d6230df46d99',
    en_text: 'How many integers from 1 to 100 are divisible by 2 or 5?',
    he_text: 'כמה מספרים שלמים בין 1 ל-100 מתחלקים ב-2 או ב-5?',
  },

  {
    id: '67cb3992-ad01-4a69-9738-1eacf9bd0985',
    en_text: 'How many integers from 1 to 100 are divisible by 3 or 7?',
    he_text: 'כמה מספרים שלמים בין 1 ל-100 מתחלקים ב-3 או ב-7?',
  },

  {
    id: '5f85faa1-6351-413d-805b-4791490e802c',
    en_text: 'How many integers from 1 to 200 are divisible by 3 or 5 or 7?',
    he_text: 'כמה מספרים שלמים בין 1 ל-200 מתחלקים ב-3 או ב-5 או ב-7?',
  },

  {
    id: 'e5bcbc7d-dbc1-4e25-aff7-742ad9c64cb2',
    en_text:
      '40 study math 50 physics 60 computer science 20 study math and physics 25 math and computer science 30 physics and computer science and 5 study all three How many students study at least one subject?',
    he_text:
      '40 לומדים מתמטיקה 50 פיזיקה 60 מדעי המחשב 20 לומדים מתמטיקה ופיזיקה 25 מתמטיקה ומדעי המחשב 30 פיזיקה ומדעי המחשב ו-5 לומדים את שלושת המקצועות כמה סטודנטים לומדים לפחות מקצוע אחד?',
  },

  {
    id: '201abf55-c8fb-4b41-ab80-b373c958a084',
    en_text: 'How many integers from 1 to 1000 are divisible by 3 or 4?',
    he_text: 'כמה מספרים שלמים בין 1 ל-1000 מתחלקים ב-3 או ב-4?',
  },

  {
    id: '74700c15-53ae-4a51-b554-ecafeb5b6840',
    en_text: 'How many three digit numbers are multiples of 2 or 5?',
    he_text: 'כמה מספרים בני שלוש ספרות הם כפולות של 2 או 5?',
  },

  {
    id: 'b7c0aefb-a927-4452-bc73-65d772e3da25',
    en_text:
      '100 like coffee 80 tea 60 juice 30 like coffee and tea 25 coffee and juice 20 tea and juice and 10 like all three How many people like at least one drink?',
    he_text:
      '100 אוהבים קפה 80 תה 60 מיץ 30 אוהבים קפה ותה 25 קפה ומיץ 20 תה ומיץ ו-10 אוהבים את כל שלושת המשקאות כמה אנשים אוהבים לפחות משקה אחד?',
  },

  {
    id: 'bdf204a0-0e77-46e1-b6e5-5002f7957a94',
    en_text: 'How many integers from 1 to 100 are divisible by 2 or 3 or 5?',
    he_text: 'כמה מספרים שלמים בין 1 ל-100 מתחלקים ב-2 או ב-3 או ב-5?',
  },

  {
    id: 'ef83ce26-fcfc-481d-a35a-96267fc5c3ea',
    en_text:
      'How many permutations of the word APPLE start with A or end with E?',
    he_text: 'כמה סידורים של המילה APPLE מתחילים באות A או מסתיימים באות E?',
  },

  {
    id: '80ecc9bb-afba-4377-8a64-cb95495ef4b8',
    en_text: 'How many integers from 1 to 60 are not divisible by 2 or 3?',
    he_text: 'כמה מספרים שלמים בין 1 ל-60 אינם מתחלקים ב-2 או ב-3?',
  },

  {
    id: 'ef7e1d80-c1bf-4daf-a630-bb17cd366073',
    en_text: 'How many 8-bit strings contain at least one 0',
    he_text: 'כמה מחרוזות באורך 8 מכילות לפחות אפס אחד',
  },

  {
    id: 'bd4445f4-6a67-4cbe-890c-2df27269c47d',
    en_text: 'How many four digit numbers contain at least one digit 7',
    he_text: 'כמה מספרים בני ארבע ספרות מכילים לפחות ספרה אחת 7',
  },

  {
    id: '19f79c58-69ed-418c-8ff5-0fd9a506437f',
    en_text: 'How many 6-letter strings from {A,B,C,D} contain at least one A',
    he_text: 'כמה מחרוזות באורך 6 מתוך {A,B,C,D} מכילות לפחות A אחת',
  },

  {
    id: 'b7dbccce-a488-4a77-874c-c9d4f555d19d',
    en_text:
      'How many four person committees from 10 students include at least one of two specific students',
    he_text:
      'כמה ועדות של ארבעה מתוך עשרה סטודנטים כוללות לפחות אחד משני סטודנטים מסוימים',
  },

  {
    id: '9e2473e6-161c-406f-9b55-dbf7d40e5dea',
    en_text: 'How many permutations of ABCDE begin with a vowel',
    he_text: 'כמה סידורים של האותיות ABCDE מתחילים בתנועה',
  },

  {
    id: '32c59695-81d3-4235-b701-277e19bcf732',
    en_text: 'How many seven digit numbers have at least one digit 5',
    he_text: 'כמה מספרים בני שבע ספרות מכילים לפחות ספרה אחת 5',
  },

  {
    id: '5f557092-8bdc-443c-82dd-173197064bb7',
    en_text:
      'How many colorings of 4 balls with 3 colors are not monochromatic',
    he_text: 'כמה צביעות של ארבעה כדורים בשלושה צבעים שאינן חד צבעוניות',
  },

  {
    id: '740f7595-295c-4e51-8250-6754eb18f8ea',
    en_text:
      'How many 5-letter words from {A,B,C,D,E} have at least one repeated letter',
    he_text: 'כמה מילים באורך 5 מתוך {A,B,C,D,E} מכילות לפחות אות אחת שחוזרת',
  },

  {
    id: '3e5a2992-04db-463f-a8b1-8b9ff57426a0',
    en_text: 'How many 5-digit strings contain at least one 0',
    he_text: 'כמה מחרוזות בנות חמש ספרות מכילות לפחות אפס אחד',
  },

  {
    id: '6425ae2e-55ba-4fb0-ba94-63896bb5a549',
    en_text:
      'How many permutations of four distinct digits include the digit 0',
    he_text: 'כמה סידורים בני ארבע ספרות שונות כוללים את הספרה 0',
  },

  {
    id: '2ffad47c-642b-4c62-acd0-06cbdcc794fd',
    en_text:
      'How many 8-letter passwords over the lowercase English alphabet contain at least one vowel',
    he_text: 'כמה סיסמאות באורך 8 מאותיות לועזיות קטנות מכילות לפחות תנועה אחת',
  },

  {
    id: 'c184c555-8fe5-425f-aa46-06d67385cedf',
    en_text:
      'How many 4-letter strings from {A,B,C,D,E,F} contain at least one vowel',
    he_text: 'כמה מחרוזות באורך 4 מתוך {A,B,C,D,E,F} מכילות לפחות תנועה אחת',
  },

  {
    id: '5f73cded-f705-4cb1-9c83-bbe4edb5aa8f',
    en_text: 'How many three digit numbers have at least one repeated digit',
    he_text: 'כמה מספרים בני שלוש ספרות מכילים לפחות ספרה חוזרת אחת',
  },

  {
    id: 'babef5a8-53fd-42d7-b502-d7d5083439e5',
    en_text:
      'How many 5-card hands from a standard deck contain at least one ace',
    he_text: 'כמה ידיים של חמש קלפים מחבילה רגילה מכילות לפחות אס אחד',
  },

  {
    id: 'be678452-e71c-4c28-932b-592b751b559c',
    en_text: 'How many 7-bit strings contain at least one 1',
    he_text: 'כמה מחרוזות באורך 7 ביטים מכילות לפחות ספרה אחת 1',
  },

  {
    id: '7c17f31e-c1f9-4035-869f-e0b929e0122f',
    en_text: 'How many subsets of {1,...,10} contain at least one of 1 or 2',
    he_text: 'כמה תתי קבוצות של {1,...,10} מכילות לפחות את 1 או 2',
  },

  {
    id: '464013a2-9067-44f6-9423-f8b7ae0763ad',
    en_text:
      'How many permutations of numbers 1 through 5 have at least one fixed point',
    he_text: 'כמה תמורות של המספרים 1 עד 5 כוללות לפחות נקודת קיבוע אחת',
  },

  {
    id: '12388bcd-e3f3-4ee6-8447-d7c73adcc067',
    en_text: 'How many four digit numbers contain at least one even digit',
    he_text: 'כמה מספרים בני ארבע ספרות מכילים לפחות ספרה זוגית אחת',
  },

  {
    id: '62478899-7c30-4628-ae5a-2c39e5d78bc2',
    en_text: 'How many ternary strings of length 5 contain at least one 2',
    he_text: 'כמה מחרוזות באורך 5 בבסיס שלוש מכילות לפחות ספרה אחת 2',
  },

  {
    id: 'b391d164-beba-42e6-ac33-c39059bbee3b',
    en_text:
      'How many arrangements of three red and three blue balls in a row have at least one pair of adjacent balls of the same color',
    he_text:
      'כמה סידורים של שלושה כדורים אדומים ושלושה כחולים בשורה מכילים לפחות זוג סמוך של כדורים באותו צבע',
  },

  {
    id: 'c1d6bbad-b174-4f06-8dbd-89aaac420be5',
    en_text: 'Yes',
    he_text: 'כן',
  },

  {
    id: '5ad96b46-8670-4368-858b-453472383bd2',
    en_text: 'No',
    he_text: 'לא',
  },
  // physics-modules-questions.seed.ts
  {
    id: 'a34d7a4b-9f41-4739-becb-a920ec24f13c',
    en_text: '0.7 km',
    he_text: '0.7 ק״מ',
  },
  // physics-modules-questions.seed.ts
  {
    id: 'AF770977-4B29-4444-B907-F819EF5D0BEA',
    en_text: '7,100 cm',
    he_text: '7,100 ס״מ',
  },
  // physics-modules-questions.seed.ts
  {
    id: 'EE38E69B-F2B3-477E-A06A-70EBB3E5F87D',
    en_text: '6.9*10^6 millimeters',
    he_text: '6.9*10^6 מילימטרים',
  },

  // MISSING MODULE TRANSLATIONS FROM modules.seed.ts
  {
    id: '09d74ad2-a8eb-4120-90df-81190243d3cf',
    en_text: 'Graph Theory',
    he_text: 'תורת הגרפים',
  },
  {
    id: '187640FA-5A52-4AC3-8EBC-1FB89091E6E8',
    en_text: 'Sum Principle',
    he_text: 'עקרון החיבור',
  },
  {
    id: 'A468A6C2-1D32-47D6-BC32-562F2F71BCB3',
    en_text: 'Multiplication Principle',
    he_text: 'עקרון הכפל',
  },
  {
    id: 'f5f24066-f9e1-4087-9d6a-598042cb0d2b',
    en_text: 'Min Max Algorithm',
    he_text: 'אלגוריתם מינ-מקס',
  },
  {
    id: 'e289a3c2-6d14-479d-89e6-a83b56e08287',
    en_text: 'Combinations with Repetitions',
    he_text: 'חליפות עם חזרות',
  },
  {
    id: 'e7c5b81e-5aad-4715-ab5d-c08122c05ef1',
    en_text: 'Permutations with Repetitions',
    he_text: 'צירופים עם חזרות',
  },
  {
    id: '453489f6-61fa-4699-b275-26d6165dbc89',
    en_text: 'Pascal Triangle',
    he_text: 'משולש פסקל',
  },
  {
    id: 'ee3583e5-7114-4a42-8a78-c1cb689276c9',
    en_text: 'Binomial Formula',
    he_text: 'נוסחת הבינום',
  },
  {
    id: '4f5a6b7c-8d9e-4012-a456-789abc123def',
    en_text: 'Inclusion Principle',
    he_text: 'עקרון ההכלה',
  },
  {
    id: '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    en_text: 'Separation Principle',
    he_text: 'עקרון ההפרדה',
  },
  {
    id: '31b7ef41-3b67-4181-ba4d-c6170399a6d9',
    en_text: 'Mathematical Recursion',
    he_text: 'רקורסיה מטמטית',
  },
  {
    id: '7cd0a3cf-23ee-44fc-ab71-aa6493eb4219',
    en_text: 'Pigeonhole Principle',
    he_text: 'עקרון שובך היונים',
  },
  {
    id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    en_text: 'Introduction to Logic',
    he_text: 'מבוא ללוגיקה',
  },
  {
    id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
    en_text: 'Basic Logic Concepts',
    he_text: 'מושגי יסוד בלוגיקה',
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-a0ef-2a3b4c5d6e7f',
    en_text: 'Logical Operators',
    he_text: 'אופרטורים לוגיים',
  },
  {
    id: '4d5e6f7a-8b9c-4d0e-a1fa-3b4c5d6e7f8a',
    en_text: 'Truth Values',
    he_text: 'ערכי אמת',
  },
  {
    id: '5e6f7a8b-9c0d-4e1f-a2ab-4c5d6e7f8a9b',
    en_text: 'Logic Gates',
    he_text: 'שערים לוגיים',
  },
  {
    id: '6f7a8b9c-0d1e-4f2a-a3bc-5d6e7f8a9b0c',
    en_text: 'Conditional Statements',
    he_text: 'טענות תנאיות',
  },
  {
    id: '7a8b9c0d-1e2f-403b-a4cd-6e7f8a9b0c1d',
    en_text: 'Logical Equivalence',
    he_text: 'שקילות לוגית',
  },

  // MORE MISSING MODULE TRANSLATIONS
  {
    id: 'afb0c4a6-d7ce-4a3b-a1ee-28c783f4be8a',
    en_text: 'Combinatorics',
    he_text: 'קומבינטוריקה',
  },
  {
    id: 'f272cd23-f130-4467-9fad-b1ec33abc0e1',
    en_text: 'Permutation',
    he_text: 'תמורות',
  },
  {
    id: 'b8a9c2d3-4e5f-4567-8901-2a3b4c5d6e7f',
    en_text: 'Combinations',
    he_text: 'חליפות',
  },
  {
    id: 'b046c3a7-4e8f-4571-a015-0a7cc33daca2',
    en_text: 'Permutations',
    he_text: 'צירופים',
  },
  {
    id: '4c031bcd-19fb-46d0-9f62-d7d8612c052f',
    en_text: 'Derangements',
    he_text: 'אי סדר מלא',
  },
  {
    id: 'eb656561-a030-482a-99d2-d648d7a4b6b1',
    en_text: 'Generating Functions',
    he_text: 'פונקציות יוצרות',
  },
  // Faculty descriptions
  {
    id: '39ae54f0-57f9-473d-82c9-785dce83f328',
    en_text: `Welcome to the Faculty of Exact Sciences, where curiosity meets precision and imagination is guided by logic. Here, you are not just a student — you are an explorer charting the fundamental laws that govern our universe. Whether you're drawn to the elegance of mathematics, the mysteries of physics, or the power of computer science, this faculty invites you to think deeply, question boldly, and solve the unsolvable.

Each course is a key, unlocking a deeper understanding of reality. You'll work alongside passionate researchers, tackle real-world problems, and build the tools that shape tomorrow — all while honing a sharp, analytical mindset that will serve you in any path you choose.

This is where your journey begins — in the exact sciences, where precision drives discovery, and discovery shapes the future.`,
    he_text: `ברוכים הבאים לפקולטה למדעים מדויקים, המקום שבו סקרנות פוגשת דיוק ודמיון מונחה על ידי היגיון. כאן, אתם לא רק סטודנטים — אתם חוקרים שמשרטטים את חוקי היסוד שמנהלים את היקום.

בין אם אתם נמשכים לאלגנטיות של המתמטיקה, למסתורין של הפיזיקה או לעוצמה של מדעי המחשב — הפקולטה הזו מזמינה אתכם לחשוב לעומק, לשאול באומץ ולפתור את הבלתי אפשרי.

כל קורס הוא מפתח להבנה עמוקה יותר של המציאות. תעבדו לצד חוקרים מלאי תשוקה, תתמודדו עם בעיות מהעולם האמיתי ותבנו את הכלים שיעצבו את המחר — וכל זה תוך חידוד החשיבה האנליטית שתשמש אתכם בכל דרך שתבחרו.

כאן מתחיל המסע שלכם — במדעים המדויקים, שם הדיוק מניע את הגילוי, והגילוי מעצב את העתיד.`,
  },
  {
    id: '758e11bb-1619-4450-b0c9-456a871f2f1e',
    en_text: `Welcome to the Faculty of Social Sciences, where understanding people is the key to shaping the world. As a student here, you're stepping into the story of humanity — exploring how we think, act, connect, and build societies.

Through disciplines like psychology, sociology, economics, political science, and more, you'll learn to see patterns in behavior, uncover the forces that drive change, and ask the big questions about justice, power, culture, and identity. You won't just study theories — you'll challenge them, debate them, and apply them to the complex world around you.

This faculty is your gateway to becoming a thoughtful analyst, a change-maker, and a voice for insight in a rapidly evolving society. Your journey to understanding the world — and influencing it — starts here.`,
    he_text: `ברוכים הבאים לפקולטה למדעי החברה, המקום שבו ההבנה של בני אדם היא המפתח לעיצוב העולם. כסטודנטים כאן, אתם נכנסים אל תוך סיפור האנושות — חוקרים כיצד אנו חושבים, פועלים, מתחברים ובונים חברות.

באמצעות תחומים כמו פסיכולוגיה, סוציולוגיה, כלכלה, מדע המדינה ועוד, תלמדו לזהות דפוסים בהתנהגות, לחשוף את הכוחות שמניעים שינוי ולשאול את השאלות הגדולות על צדק, כוח, תרבות וזהות. לא רק תלמדו תיאוריות — תערערו עליהן, תדונו בהן ותיישמו אותן על העולם המורכב שסביבכם.

הפקולטה הזו היא שער עבורכם להפוך לאנליסטים מעמיקים, מחוללי שינוי וקולות של תובנה בחברה שמתפתחת במהירות. המסע שלכם להבנת העולם — ולהשפעה עליו — מתחיל כאן.`,
  },
  {
    id: '461c044e-c567-4d6b-bf11-a42b73cb6525',
    en_text: `Welcome to the Faculty of Engineering, where ideas become reality and innovation meets impact. As a student here, you're not just learning how things work — you're learning how to build what's next.

From circuits to code, structures to systems, this is where theory meets creation. You'll design, test, and optimize solutions to real-world challenges, armed with both scientific principles and hands-on experience. Every formula you master and every model you build brings you one step closer to shaping the future — smarter cities, cleaner energy, faster networks, stronger infrastructure.

In the Faculty of Engineering, you're more than a student — you're an inventor in training, an architect of progress, and a problem-solver the world is waiting for.`,
    he_text: `ברוכים הבאים לפקולטה להנדסה, המקום שבו רעיונות הופכים למציאות וחדשנות פוגשת השפעה אמיתית. כאן אתם לא רק לומדים איך דברים פועלים — אתם לומדים איך לבנות את הדבר הבא.

ממעגלים לקוד, ממבנים למערכות — כאן התיאוריה פוגשת את העשייה. תתכננו, תבדקו ותשפרו פתרונות לאתגרים מהעולם האמיתי, חמושים הן בעקרונות מדעיים והן בניסיון מעשי. כל נוסחה שתשלוטו בה וכל מודל שתבנו יקחו אתכם צעד נוסף לעבר עיצוב העתיד — ערים חכמות, אנרגיה נקייה, רשתות מהירות ותשתיות חזקות.

בפקולטה להנדסה אתם הרבה מעבר לסטודנטים — אתם ממציאים בתהליך הכשרה, אדריכלי קִדמה ופותרים בעיות שהעולם מחכה להם.`,
  },
  {
    id: '401d30ef-cc8d-42d9-97b4-c81d5f390146',
    en_text: `Welcome to the Faculty of Arts, where expression becomes exploration and creativity shapes understanding. As a student here, you're invited to see the world not just as it is — but as it could be.

Whether through language, literature, history, philosophy, or the visual and performing arts, you'll engage with the ideas, cultures, and voices that define human experience. You'll question, interpret, and create — developing not only critical thinking but a deep appreciation for nuance, meaning, and beauty.

In the Faculty of Arts, you're not just learning about the world — you're learning how to reflect it, challenge it, and reimagine it through your own unique lens. This is where your voice finds its depth and your perspective finds its power.`,
    he_text: `ברוכים הבאים לפקולטה לאמנויות, המקום שבו הבעה הופכת לחקירה ויצירתיות מעצבת הבנה. כסטודנטים כאן, אתם מוזמנים לראות את העולם לא רק כפי שהוא — אלא כפי שהוא יכול להיות.

בין אם דרך שפה, ספרות, היסטוריה, פילוסופיה או האמנויות החזותיות והבמה, תעסקו ברעיונות, תרבויות וקולות שמעצבים את החוויה האנושית. תשאלו שאלות, תפרשו ותיצרו — ותפתחו לא רק חשיבה ביקורתית, אלא גם הערכה עמוקה לדקויות, למשמעות וליופי.

בפקולטה לאמנויות אתם לא רק לומדים על העולם — אתם לומדים כיצד לשקף אותו, לאתגר אותו ולדמיין אותו מחדש דרך העדשה הייחודית שלכם. כאן הקול שלכם מוצא עומק, והזווית שלכם מקבלת עוצמה.`,
  },
  // Physics questions
  {
    id: 'cb8ad153-c31b-4e22-91f6-c5e9e6f4637a',
    en_text:
      'Which of the following three distances is the largest, which one is the smallest?',
    he_text: 'איזה מהמרחקים הבאים הוא הגדול ביותר, איזה הוא הקטן ביותר?',
  },
  {
    id: '480ca700-a7ce-43a5-a81f-19ff3461f4b9',
    en_text:
      'Calculate the area, in square meters (m²), of a rectangle with a length of 80 cm and a width of 120 cm.',
    he_text:
      'חשב את השטח, במטרים רבועים (m²), של מלבן באורך 80 ס"מ וברוחב 120 ס"מ.',
  },
  // Missing question translations
  {
    id: 'f254ae75-8818-47a2-840f-c2987ee53692',
    en_text: 'Whether G is not a bipartite graph',
    he_text: 'האם G אינו גרף דו-חלקי',
  },
  {
    id: '9961349f-a8e1-4a32-9f06-67240b8df069',
    en_text:
      "How many permutations are there of the letters in the word 'APPLE'?",
    he_text: "כמה תמורות יש לאותיות במילה 'APPLE'?",
  },
  {
    id: '9d088bfe-fa4d-4c92-ac76-c0f944a8076b',
    en_text:
      "In how many distinct ways can the letters of the word 'MISSISSIPPI' be arranged?",
    he_text: "בכמה דרכים שונות ניתן לסדר את האותיות במילה 'MISSISSIPPI'?",
  },
  {
    id: '6b1c635c-ddf3-427b-b3f1-20b34c0d5f91',
    en_text:
      "How many distinct permutations can be made from the letters of the word 'MATHEMATICS'?",
    he_text: "כמה תמורות שונות ניתן ליצור מהאותיות במילה 'MATHEMATICS'?",
  },
  {
    id: '2c854b57-56de-408a-bd48-b9663297c72f',
    en_text:
      "How many permutations of the letters in the word 'LEVEL' are possible?",
    he_text: "כמה תמורות אפשריות לאותיות במילה 'LEVEL'?",
  },
  {
    id: '61ce9acb-e53b-4a6c-ac8d-76a8322f7661',
    en_text: "How many permutations are there of the word 'BANANA'?",
    he_text: "כמה תמורות יש למילה 'BANANA'?",
  },
  {
    id: '1a23ed2e-0d39-4956-adc4-a0e0185cb226',
    en_text:
      "How many distinct permutations can be made from the letters of the word 'STATISTICS'?",
    he_text: "כמה תמורות שונות אפשר ליצור מהאותיות במילה 'STATISTICS'?",
  },

  {
    id: 'e3d93d41-3050-493a-8ad6-19105b04613f',
    en_text:
      "What is the value of the binomial coefficient C(5, 2) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(5, 2) במשולש פסקל?',
  },
  {
    id: 'a4e3c1a8-e257-4fe8-be97-f2c3cd035b13',
    en_text:
      "What is the value of the binomial coefficient C(6, 3) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(6, 3) במשולש פסקל?',
  },
  {
    id: 'dcbdede0-9014-4c63-9981-cd22e7d1ec4f',
    en_text:
      "What is the value of the binomial coefficient C(7, 4) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(7, 4) במשולש פסקל?',
  },
  {
    id: 'b12833a0-1b09-464a-ad7c-e148c216bccb',
    en_text:
      "What is the value of the binomial coefficient C(8, 2) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(8, 2) במשולש פסקל?',
  },
  {
    id: 'c532bcb3-323a-4fea-9a98-3a60be8b2db8',
    en_text:
      "What is the value of the binomial coefficient C(9, 5) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(9, 5) במשולש פסקל?',
  },
  {
    id: '4999aece-1387-4622-8f15-298daa82042f',
    en_text:
      "What is the value of the binomial coefficient C(10, 3) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(10, 3) במשולש פסקל?',
  },
  {
    id: 'c4633ba3-7b62-43f4-b3ab-1bd1a6cf5376',
    en_text:
      "What is the value of the binomial coefficient C(11, 6) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(11, 6) במשולש פסקל?',
  },
  {
    id: '7826ef3c-e828-425d-a27a-378ad632403b',
    en_text:
      "What is the value of the binomial coefficient C(12, 4) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(12, 4) במשולש פסקל?',
  },
  {
    id: 'f43412c8-10de-4891-af23-2b01dd9926ec',
    en_text:
      "What is the value of the binomial coefficient C(13, 7) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(13, 7) במשולש פסקל?',
  },
  {
    id: '76d2408f-653b-49ae-b9af-745ecfb4cd73',
    en_text:
      "What is the value of the binomial coefficient C(14, 2) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(14, 2) במשולש פסקל?',
  },
  {
    id: 'adf4012f-0b43-4416-91a2-74e10faac950',
    en_text:
      "What is the value of the binomial coefficient C(15, 5) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(15, 5) במשולש פסקל?',
  },
  {
    id: '39c8fd20-7b0c-43db-a87f-a54e0f27d0ed',
    en_text:
      "What is the value of the binomial coefficient C(16, 8) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(16, 8) במשולש פסקל?',
  },
  {
    id: 'cd4f8d35-467c-47d4-9f9f-7a7677aea4e5',
    en_text:
      "What is the value of the binomial coefficient C(17, 3) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(17, 3) במשולש פסקל?',
  },
  {
    id: '9aadd258-78f3-42a8-bc22-1fa381a4a773',
    en_text:
      "What is the value of the binomial coefficient C(18, 9) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(18, 9) במשולש פסקל?',
  },
  {
    id: '17d9e6b4-0346-4b44-8e41-9ee32e401f08',
    en_text:
      "What is the value of the binomial coefficient C(19, 4) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(19, 4) במשולש פסקל?',
  },
  {
    id: 'ae1945da-835a-4a0d-bac9-ee97eb818b7e',
    en_text:
      "What is the value of the binomial coefficient C(20, 10) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(20, 10) במשולש פסקל?',
  },
  {
    id: 'ad136e05-f9ee-4a20-91fc-a4b411bd1506',
    en_text:
      "What is the value of the binomial coefficient C(21, 7) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(21, 7) במשולש פסקל?',
  },
  {
    id: '1cd52c38-19eb-430a-8ac6-404cbb9c14b6',
    en_text:
      "What is the value of the binomial coefficient C(22, 11) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(22, 11) במשולש פסקל?',
  },
  {
    id: '70c7622b-23c5-4de7-9bcd-198748654be4',
    en_text:
      "What is the value of the binomial coefficient C(23, 5) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(23, 5) במשולש פסקל?',
  },
  {
    id: '26d7aa85-f8ad-4484-b9dc-5a3dc992c4db',
    en_text:
      "What is the value of the binomial coefficient C(24, 12) found in Pascal's Triangle?",
    he_text: 'מהו הערך של המקדם הבינומי C(24, 12) במשולש פסקל?',
  },

  {
    id: 'b0faab8f-eb6b-4cb2-ad14-30254ef179fc',
    en_text:
      'A bookstore sells 5 fiction and 7 non-fiction titles. How many choices are there if you select one book from either category?',
    he_text:
      'חנות ספרים מוכרת 5 ספרי סיפורת ו-7 ספרי עיון. כמה אפשרויות יש אם בוחרים ספר אחד מאחת הקטגוריות?',
  },

  {
    id: 'cdeaf3e0-d9db-44c7-9aad-0d974e6ea546',
    en_text:
      'A clothing store offers 4 shirts and 6 pants. How many items can you choose from if selecting either a shirt or pants?',
    he_text:
      'חנות בגדים מציעה 4 חולצות ו-6 מכנסיים. כמה פריטים ניתן לבחור אם בוחרים חולצה או מכנסיים?',
  },

  {
    id: '65b9fa9f-8a10-4a5a-9400-6f910708ced2',
    en_text:
      'A library has 8 English magazines and 5 Hebrew magazines. How many magazines could you borrow if choosing one language?',
    he_text:
      'בספרייה יש 8 מגזינים באנגלית ו-5 בעברית. כמה מגזינים ניתן להשאיל אם בוחרים בשפה אחת?',
  },

  {
    id: '96f33cd2-c9a5-4c60-8ffe-0d21c4fa04c4',
    en_text:
      'A cafe menu lists 6 hot drinks and 3 cold drinks. How many options exist if you pick one drink of any temperature?',
    he_text:
      'בתפריט בית הקפה יש 6 משקאות חמים ו-3 משקאות קרים. כמה אפשרויות יש אם ניתן לבחור משקה אחד מאחת הקטגוריות?',
  },

  {
    id: '602fdc46-93dd-416e-bb3c-fc8badd26251',
    en_text:
      'A university offers 5 morning classes and 4 evening classes. How many classes can a student choose from if limited to one time slot?',
    he_text:
      'אוניברסיטה מציעה 5 שיעורי בוקר ו-4 שיעורי ערב. כמה שיעורים ניתן לבחור אם מוגבלים למועד אחד?',
  },

  {
    id: '5201f907-d004-4932-98a3-3ecd2ef71ad9',
    en_text:
      'A tech conference has 7 workshops on day one and 5 workshops on day two. How many workshops can you attend if you attend only one day?',
    he_text:
      'בכנס טכנולוגיה יש 7 סדנאות ביום הראשון ו-5 ביום השני. כמה סדנאות ניתן להשתתף אם מגיעים ליום אחד בלבד?',
  },

  {
    id: '28ac3388-d73e-414e-83d9-d92aa9d82a61',
    en_text:
      'A theater shows 3 comedies and 5 dramas. How many films could you watch if you choose from either genre?',
    he_text:
      'תיאטרון מקרין 3 קומדיות ו-5 דרמות. כמה סרטים ניתן לצפות אם בוחרים מז׳אנר אחד?',
  },

  {
    id: '275e3588-98b0-424a-b6f3-ef2958150009',
    en_text:
      'A travel agency has 4 domestic packages and 6 international packages. How many packages are available if you choose only one?',
    he_text:
      'סוכנות נסיעות מציעה 4 חבילות בארץ ו-6 חבילות לחו״ל. כמה חבילות זמינות אם בוחרים רק אחת?',
  },

  {
    id: '65165ce6-c6cd-438e-8660-dcf2105f9c59',
    en_text:
      'A sports club offers 5 indoor activities and 4 outdoor activities. How many activities can you select if participating in only one?',
    he_text:
      'מועדון ספורט מציע 5 פעילויות בתוך מבנה ו-4 פעילויות חוץ. כמה פעילויות ניתן לבחור אם משתתפים רק באחת?',
  },

  {
    id: '1a4f5e63-7e43-4ee6-b07a-be5c15cd7366',
    en_text:
      'A music festival features 6 rock bands and 2 jazz bands. How many bands can a fan watch if they pick a single genre?',
    he_text:
      'פסטיבל מוזיקה מציג 6 להקות רוק ו-2 להקות ג׳אז. כמה להקות ניתן לראות אם בוחרים ז׳אנר אחד?',
  },

  {
    id: '23122bf9-a9b8-413e-a332-892d419017c4',
    en_text:
      'A grocery store sells 7 kinds of fruit and 4 kinds of vegetables. How many choices are there if buying one item from either group?',
    he_text:
      'חנות מכולת מוכרת 7 סוגי פירות ו-4 סוגי ירקות. כמה אפשרויות יש אם קונים פריט אחד מאחת הקבוצות?',
  },

  {
    id: '2b6cba5a-27dc-4e02-8e90-7a3ca6490515',
    en_text:
      'A museum offers 2 guided tours in English and 3 in Spanish. How many tours could a visitor take if choosing one language?',
    he_text:
      'מוזיאון מציע 2 סיורים מודרכים באנגלית ו-3 בספרדית. כמה סיורים יכול מבקר לקחת אם הוא בוחר שפה אחת?',
  },

  {
    id: 'efc49f76-65ac-4f41-8329-17b055ff654f',
    en_text:
      'A park has 5 picnic areas and 3 playgrounds. How many locations can a family choose if visiting just one?',
    he_text:
      'בפארק יש 5 אזורי פיקניק ו-3 מגרשי משחקים. כמה מקומות יכולה משפחה לבחור אם מבקרת רק באחד?',
  },

  {
    id: 'e68b7607-efea-4b4c-a677-4a63db960f7a',
    en_text:
      'An online course platform has 4 math courses and 5 science courses. How many courses can a student enroll in if choosing one subject?',
    he_text:
      'בפלטפורמת קורסים מקוונת יש 4 קורסי מתמטיקה ו-5 קורסי מדע. כמה קורסים יכול סטודנט להירשם אם בוחר מקצוע אחד?',
  },

  {
    id: 'e6690c2e-0fc7-404d-a71d-d77845910b54',
    en_text:
      'A bookstore sells 6 hardcover and 3 paperback journals. How many journals can be selected if choosing either type?',
    he_text:
      'חנות ספרים מוכרת 6 יומנים בכריכה קשה ו-3 בכריכה רכה. כמה יומנים ניתן לבחור אם בוחרים סוג אחד?',
  },

  {
    id: '30da94db-17de-4218-b041-f4caf651f7be',
    en_text:
      'A gym schedules 3 morning and 4 evening yoga classes. How many classes are available if attending only one session?',
    he_text:
      'חדר כושר מקיים 3 שיעורי יוגה בבוקר ו-4 בערב. כמה שיעורים זמינים אם משתתפים רק באחד?',
  },

  {
    id: '0dec8af3-f8d6-4e8b-ba1e-a7059b78174e',
    en_text:
      'A pet shop has 5 breeds of dogs and 2 breeds of cats. How many animal choices are available if adopting one pet?',
    he_text:
      'חנות חיות מחזיקה 5 גזעי כלבים ו-2 גזעי חתולים. כמה אפשרויות חיות זמינות אם מאמצים חיה אחת?',
  },

  {
    id: 'fa2a7e90-3615-498c-8d8f-e958ffde4c51',
    en_text:
      'A science fair displays 4 physics projects and 5 chemistry projects. How many projects can a visitor view if focusing on one subject?',
    he_text:
      'ביריד מדע מוצגים 4 פרויקטים בפיזיקה ו-5 בכימיה. כמה פרויקטים יכול מבקר לראות אם מתמקד בנושא אחד?',
  },

  {
    id: '6b8fcbdf-b0a2-42eb-a9b1-161f7f92f7ac',
    en_text:
      'A store offers 6 types of lamps and 4 types of chairs. How many items can a customer choose from if buying just one?',
    he_text:
      'חנות מציעה 6 סוגי מנורות ו-4 סוגי כיסאות. כמה פריטים יכול לקוח לבחור אם קונה רק אחד?',
  },

  {
    id: '1f8f28f2-7d5d-4598-a447-930ef4c2147b',
    en_text:
      'A restaurant provides 3 vegan dishes and 6 non-vegan dishes. How many meal options exist if ordering a single dish?',
    he_text:
      'מסעדה מציעה 3 מנות טבעוניות ו-6 מנות שאינן טבעוניות. כמה אפשרויות ארוחה קיימות אם מזמינים מנה אחת?',
  },

  {
    id: 'aabf8758-d93e-4e54-a49c-1d515976a64d',
    en_text:
      'How many distinct permutations can be formed from the letters of "LEVEL"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "LEVEL"?',
  },

  {
    id: 'ba29646f-67d7-4c09-92b2-d64eaff717b5',
    en_text:
      'How many distinct permutations can be formed from the letters of "BALLOON"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "BALLOON"?',
  },

  {
    id: 'fe4b0bac-e929-4a78-90e1-34b51de33c21',
    en_text:
      'How many distinct permutations can be formed from the letters of "SUCCESS"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "SUCCESS"?',
  },

  {
    id: 'ab17462a-7c93-493b-b7a2-51c30c382d64',
    en_text:
      'How many distinct permutations can be formed from the letters of "BOOKKEEPER"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "BOOKKEEPER"?',
  },

  {
    id: '237d697b-3b2e-4516-98e2-3270133d2f85',
    en_text:
      'How many distinct permutations can be formed from the letters of "BANANA"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "BANANA"?',
  },

  {
    id: '9a1548f9-a17d-487b-8a43-8fd45f7680d4',
    en_text:
      'How many distinct permutations can be formed from the letters of "MISSISSIPPI"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "MISSISSIPPI"?',
  },

  {
    id: 'd87423c1-f864-436a-ab0b-9f0c2d918acb',
    en_text:
      'How many distinct permutations can be formed from the letters of "ABRACADABRA"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "ABRACADABRA"?',
  },

  {
    id: 'c3362060-fd2b-48c4-9706-0483203804e3',
    en_text:
      'How many distinct permutations can be formed from the letters of "COMMITTEE"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "COMMITTEE"?',
  },

  {
    id: 'b56d8c45-8bf1-4c60-bcbb-356f9f510219',
    en_text:
      'How many distinct permutations can be formed from the letters of "TOMATO"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "TOMATO"?',
  },

  {
    id: '5adc6247-9b27-4a3d-b129-3120f4ea11ef',
    en_text:
      'How many distinct permutations can be formed from the letters of "STATISTICS"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "STATISTICS"?',
  },

  {
    id: '6efa549c-7c42-4b96-92df-9838aafc0055',
    en_text:
      'How many distinct permutations can be formed from the letters of "LETTER"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "LETTER"?',
  },

  {
    id: '18886c3a-c65a-4cc1-9f9e-8860ab46b41c',
    en_text:
      'How many distinct permutations can be formed from the letters of "PEPPER"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "PEPPER"?',
  },

  {
    id: 'f27e83c6-1ba1-49a1-affd-2b3e495a6810',
    en_text:
      'How many distinct permutations can be formed from the letters of "REPETITION"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "REPETITION"?',
  },

  {
    id: '75bb7259-3ace-4718-81c1-4998a65dab65',
    en_text:
      'How many distinct permutations can be formed from the letters of "INDIVISIBILITY"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "INDIVISIBILITY"?',
  },

  {
    id: '53ea50b1-c820-429b-a13e-e3f83d7e9e80',
    en_text:
      'How many distinct permutations can be formed from the letters of "BASEBALL"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "BASEBALL"?',
  },

  {
    id: '9342dba7-cf94-406b-b65c-4b91e60ecf48',
    en_text:
      'How many distinct permutations can be formed from the letters of "HALLELUJAH"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "HALLELUJAH"?',
  },

  {
    id: '827ab7b0-b8a5-41f3-ac67-1d58e95b382d',
    en_text:
      'How many distinct permutations can be formed from the letters of "PROGRAMMER"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "PROGRAMMER"?',
  },

  {
    id: '76057411-8100-4138-83d6-3b4fa0b90c59',
    en_text:
      'How many distinct permutations can be formed from the letters of "ASSESSMENT"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "ASSESSMENT"?',
  },

  {
    id: '8a12359c-9d82-4860-bec1-a536fe2732b7',
    en_text:
      'How many distinct permutations can be formed from the letters of "PARALLEL"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "PARALLEL"?',
  },

  {
    id: '9f5d1a71-17dc-4a2c-9f9e-72436d37fe87',
    en_text:
      'How many distinct permutations can be formed from the letters of "CANNON"?',
    he_text: 'כמה סידורים שונים ניתן ליצור מהמילה "CANNON"?',
  },
];
