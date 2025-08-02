import { Prisma } from 'generated/client';
import { SeedCache } from './cache';

export const seedModules = async (
  tx: Prisma.TransactionClient,
  cache: SeedCache,
) => {
  console.log('Seeding modules...');

  // Deterministic IDs for block relationships
  const getBlockRelationshipId = (
    prerequisite: string,
    postrequisite: string,
  ): string => {
    const relationshipMap: Record<string, string> = {
      'Basic Units_Derived Units': '504a8133-8c3f-40b9-a874-11ebdeb76917',
      'SI System_One Dimensional Kinematics':
        'c28b0006-13a2-422d-ae56-b75ddc686087',
      'Propositional Logic_First-order Logic':
        'bba994cb-72e3-465e-b4fa-47d2189870b1',
      'Set Theory_Graph Theory': '06cf92b7-1e0e-4f7a-964b-1527f3f2246a',
      'Set Theory_Combinatorics': 'dada74b5-207c-48f3-8d2e-b8f6b806a801',
      'Combinations_Combinations with Repetitions':
        'fcfd331c-bd37-4a51-b638-866fa5df19fe',
      'Permutations_Permutations with Repetitions':
        '27d30775-72bb-41a2-b974-3d9883e6bb12',
      'Sum Principle_Multiplication Principle':
        '6a70e70d-a1e0-486e-9c55-b22090cede3f',
      'Multiplication Principle_Permutations':
        '9b81c7e2-4f6a-4d8b-b123-4c5d6e7f8a90',
      'Basic Logic Concepts_Logical Operators':
        '4a5b6c7d-8e9f-4412-a456-789abc123def',
      'Basic Logic Concepts_Truth Values':
        '5b6c7d8e-9f01-4123-b567-89abcd234eff',
      'Logical Operators_Logic Gates': '6c7d8e9f-0123-4234-a678-9abcde345f01',
      'Truth Values_Conditional Statements':
        '7d8e9f01-1234-4345-a789-abcdef456012',
      'Logical Operators_Logical Equivalence':
        '8e9f0123-2345-4456-a89a-bcdef0567123',
    };
    return relationshipMap[`${prerequisite}_${postrequisite}`] || '';
  };

  // Deterministic IDs for relationship metadata
  const getRelationshipMetadataId = (blockRelationshipId: string): string => {
    const metadataMap: Record<string, string> = {
      '504a8133-8c3f-40b9-a874-11ebdeb76917':
        '11dba38f-d605-419c-af84-6485643d9745',
      'c28b0006-13a2-422d-ae56-b75ddc686087':
        '172b5a52-3d1b-4b4f-a2ad-860a5ec1799c',
      'bba994cb-72e3-465e-b4fa-47d2189870b1':
        '37e31f31-553a-4962-bdea-b5f86807aade',
      '06cf92b7-1e0e-4f7a-964b-1527f3f2246a':
        'b91b3590-cd7a-41ec-89ef-021017f4d93d',
      'dada74b5-207c-48f3-8d2e-b8f6b806a801':
        '8586bfd9-3c66-49e5-8658-4aa3f248ec25',
      'fcfd331c-bd37-4a51-b638-866fa5df19fe':
        '60158639-40cb-43b6-b89e-57fe34cd9800',
      '27d30775-72bb-41a2-b974-3d9883e6bb12':
        '3a2e73e6-3274-484e-af07-6fe40cd22ef9',
      '6a70e70d-a1e0-486e-9c55-b22090cede3f':
        'c5681550-91a0-47ae-83b2-efaaf361ca6b',
      '9b81c7e2-4f6a-4d8b-b123-4c5d6e7f8a90':
        'e6792661-02b1-48bf-94c3-f0bbf472db7c',
      '4a5b6c7d-8e9f-4412-a456-789abc123def':
        '9f0e1d2c-3b4a-4968-a7dc-ba1234567890',
      '5b6c7d8e-9f01-4123-b567-89abcd234eff':
        'a01f2e3d-4c5b-4a79-a8ed-cb2345678901',
      '6c7d8e9f-0123-4234-a678-9abcde345f01':
        'b120394e-5d6c-4b8a-9012-dc3456789012',
      '7d8e9f01-1234-4345-a789-abcdef456012':
        'c2314a5f-6e7d-4c9b-a123-ed4567890123',
      '8e9f0123-2345-4456-a89a-bcdef0567123':
        'd342b516-7f8e-4d0c-b234-fe5678901234',
    };
    return metadataMap[blockRelationshipId] || '';
  };

  // Deterministic translation IDs for modules
  const getModuleTranslationId = (moduleText: string): string => {
    const translationMap: Record<string, string> = {
      'Graph Theory': '09d74ad2-a8eb-4120-90df-81190243d3cf',
      Combinatorics: 'afb0c4a6-d7ce-4a3b-a1ee-28c783f4be8a',
      Permutation: 'f272cd23-f130-4467-9fad-b1ec33abc0e1',
      'Sum Principle': '187640FA-5A52-4AC3-8EBC-1FB89091E6E8',
      'Multiplication Principle': 'A468A6C2-1D32-47D6-BC32-562F2F71BCB3',
      'Min Max Algorithm': 'f5f24066-f9e1-4087-9d6a-598042cb0d2b',
      Combinations: 'b8a9c2d3-4e5f-4567-8901-2a3b4c5d6e7f',
      Permutations: 'b046c3a7-4e8f-4571-a015-0a7cc33daca2',
      'Combinations with Repetitions': 'e289a3c2-6d14-479d-89e6-a83b56e08287',
      'Permutations with Repetitions': 'e7c5b81e-5aad-4715-ab5d-c08122c05ef1',
      'Pascal Triangle': '453489f6-61fa-4699-b275-26d6165dbc89',
      'Binomial Formula': 'ee3583e5-7114-4a42-8a78-c1cb689276c9',
      'Inclusion Principle': '4f5a6b7c-8d9e-4012-a456-789abc123def',
      'Separation Principle': '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
      'Mathematical Recursion': '31b7ef41-3b67-4181-ba4d-c6170399a6d9',
      'Introduction to Logic': '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      'Basic Logic Concepts': '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
      'Logical Operators': '3c4d5e6f-7a8b-4c9d-a0ef-2a3b4c5d6e7f',
      'Truth Values': '4d5e6f7a-8b9c-4d0e-a1fa-3b4c5d6e7f8a',
      'Logic Gates': '5e6f7a8b-9c0d-4e1f-a2ab-4c5d6e7f8a9b',
      'Conditional Statements': '6f7a8b9c-0d1e-4f2a-a3bc-5d6e7f8a9b0c',
      'Logical Equivalence': '7a8b9c0d-1e2f-403b-a4cd-6e7f8a9b0c1d',
    };
    return translationMap[moduleText] || '';
  };

  const moduleIds: Record<string, string> = {
    'SI System': 'af0bd650-5f32-4dad-ba38-cea69f616692',
    'Basic Units': '62e38ada-eb92-4a9c-bd52-943f6ed49b17',
    'Derived Units': '7f7b0380-8d2d-45f2-9a8a-645755fadf42',
    'One Dimensional Kinematics': '98c59241-27f0-4aec-9e33-84404d014b73',
    'Average Velocity': '240c2395-db81-48fb-9f3a-e39081da6b9f',
    'Instantaneous Velocity': '4d32cda4-d5c6-4165-a987-a35b313e148e',
    'Two Dimensional Graph Reading': '435bd8ba-3c4c-474d-9d04-3d55cbab9d6f',
    'Number Systems': '3ad31ae2-3870-4d9d-8826-284bd8c34b12',
    'Propositional Logic': 'ec8270ca-1f32-4928-a2c6-2f998f6061b6',
    'First-order Logic': '016ddc51-9b0a-43d0-9ac5-8fe54d171b29',
    'How to Formalize': 'a56fb4f6-cd1f-42e2-83ce-16dafaf2f067',
    'Structural Induction': '574e782a-2a2f-4b40-8d4e-79d1901e458e',
    Semantics: 'c80139f4-bcbb-4971-a43f-1132ae1c7e13',
    'Logic Satisfiability & Consistency':
      '506521a0-7219-40ba-ae0e-609e012654ce',
    'Hilbert System': 'fce22107-4e8d-435c-9534-da7c38340441',
    'Proof Theory': '6ef0d2f1-a1df-4118-ab9f-0b804968d490',
    'Set Theory': '6e19169a-959d-4f5d-a475-de09ca9ba8cd',
    'Prenex Normal Form': '96faa327-fae1-479a-907c-2e96ab8ee7cf',
    'Convergent Subsequences': 'f2663296-2bcc-4e50-b079-8986d078bbbf',
    'Rules of Inference': '6aee8076-d604-4357-b5dd-58f1c43a23b2',
    'Reading Rules of Inference': 'bdcc18bf-e894-4e7c-afc9-02f155a0596b',
    'Modus Ponens': '5686a719-6e80-4936-b585-cff43bad4842',
    'Modus Tollens': 'fc0c176d-4992-4a99-8070-d30a948c845c',
    'Truth Tables': '19a75237-5577-45a6-aedc-60a2995eb88a',
    'Consistency and Satisfiability of Sets of Propositions':
      'fbda2932-3737-49a6-aaa4-77be8d0ca6a9',
    Axioms: 'bd422960-2e1e-4fb2-8acb-effd3bcb9b96',
    'Soundness and Completeness': 'bf115d1c-6352-4421-9d43-b5c13f9377f6',
    'Quantifiers (∀, ∃)': '580f5e90-cd5a-4539-a07a-222e82497b27',
    'Quantifiers (∀, ∃) and their effect on formula complexity (rank/degree)':
      '888d9b93-facd-47f4-9f6b-51056e6445bf',
    'Cartesian Coordinate System': '4a40f86d-4d11-42c9-b311-f9c8a0f56769',
    Interval: '3139990f-60d0-4ea0-9a27-c4a39ec6276b',
    'Absolute Value': '869a58bd-7484-432d-978d-6a77a4af0821',
    'Properties of the Absolute Value': '04479133-a106-4341-82cd-c19240a87ed9',
    'Graph Theory': '8f4e9a3b-2c1d-4f5e-9a8b-7c3d6e5f8a9b',
    Combinatorics: '2b8d7f9c-3a4e-4b5f-8c9d-1e2f3a4b5c6d',
    Permutation: '65acc4b0-c258-4bd0-8eb0-e686006d224d',
    'Sum Principle': '78123942-6F56-4C66-8881-B49BC26E107D',
    'Multiplication Principle': '81BE3915-2C63-470E-85FE-55C1062DEFF3',
    'Min Max Algorithm': '70bf7dc6-cbb8-4f2e-b2e3-1736586c7d9d',
    Combinations: '9c8e5d2a-4b7f-4c8d-9e0a-1b2c3d4e5f6a',
    Permutations: 'c6dd59ac-1802-4bc9-b91e-ca77bb32620e',
    'Combinations with Repetitions': '87a1da94-793c-4565-8706-8fd073a50cf6',
    'Permutations with Repetitions': 'f2866b62-f4f6-4e22-8fcc-f4bd8bbdb275',
    'Pascal Triangle': '82da973e-a84a-44f4-b33f-bcf907961eb3',
    'Binomial Formula': 'e1367766-2b1a-42f9-a725-58d092bbc080',
    'Inclusion Principle': '4f5a6b7c-8d9e-4012-a456-789abc123def',
    'Separation Principle': '5a6b7c8d-9e0f-4123-b567-89abcd234eff',
    'Mathematical Recursion': '37d15e78-fcf2-49a0-bbde-b4dbffd904a7',
    'Introduction to Logic': '3f2e1d4c-5b6a-4789-8c0d-1e2f3a4b5c6d',
    'Basic Logic Concepts': '8b9c0d1e-2f3a-4b5c-86de-8f9a0b1c2d3e',
    'Logical Operators': '9c0d1e2f-3a4b-4c6d-87ef-9a0b1c2d3e4f',
    'Truth Values': '0d1e2f3a-4b5c-4d7e-a8fa-0b1c2d3e4f5a',
    'Logic Gates': '1e2f3a4b-5c6d-4e8f-a9ab-1c2d3e4f5a6b',
    'Conditional Statements': '2f3a4b5c-6d7e-4f9a-a0bc-2d3e4f5a6b7c',
    'Logical Equivalence': '3a4b5c6d-7e8f-409b-a1cd-3e4f5a6b7c8d',
  };

  const modules = [
    {
      en_text: 'SI System',
      he_text: 'מערכת היחידות הבין לאומיות',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'Basic Units',
      he_text: 'יחידות בסיסיות',
      parent: 'SI System',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'Derived Units',
      he_text: 'יחידות נגזרות',
      parent: 'SI System',
      prerequisite: 'Basic Units',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'One Dimensional Kinematics',
      he_text: 'קינמטיקה חד ממדית',
      prerequisite: 'SI System',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'Average Velocity',
      he_text: 'מהירות ממוצעת',
      parent: 'One Dimensional Kinematics',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'Instantaneous Velocity',
      he_text: 'מהירות רגעית',
      parent: 'One Dimensional Kinematics',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'Two Dimensional Graph Reading',
      he_text: 'קריאת גרפים דו ממדית',
      parent: 'Cartesian Coordinate System',
      course: 'Foundations of Physics A',
    },
    {
      en_text: 'Number Systems',
      he_text: 'מערכות מספרים',
      courses: ['Calculus A', 'Infinitesimal Calculus 1'],
    },
    {
      en_text: 'Propositional Logic',
      he_text: 'לוגיקה פרופוזיציונלית',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'First-order Logic',
      he_text: 'לוגיקה מסדר ראשון',
      prerequisite: 'Propositional Logic',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'How to Formalize',
      he_text: 'איך מפרמלים',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Structural Induction',
      he_text: 'אינדוקציה מבנית',
      parent: 'Proof Theory',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Semantics',
      he_text: 'סמנטיקה',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Logic Satisfiability & Consistency',
      he_text: 'נאותות ושלמות',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Hilbert System',
      he_text: 'מערכת הילברט',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Proof Theory',
      he_text: 'תורת ההוכחות',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Set Theory',
      he_text: 'תורת הקבוצות',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Introduction to Logic',
      he_text: 'מבוא ללוגיקה',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Basic Logic Concepts',
      he_text: 'מושגי יסוד בלוגיקה',
      parent: 'Introduction to Logic',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Logical Operators',
      he_text: 'אופרטורים לוגיים',
      parent: 'Introduction to Logic',
      prerequisite: 'Basic Logic Concepts',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Truth Values',
      he_text: 'ערכי אמת',
      parent: 'Introduction to Logic',
      prerequisite: 'Basic Logic Concepts',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Logic Gates',
      he_text: 'שערים לוגיים',
      parent: 'Introduction to Logic',
      prerequisite: 'Logical Operators',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Conditional Statements',
      he_text: 'טענות תנאיות',
      parent: 'Introduction to Logic',
      prerequisite: 'Truth Values',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Logical Equivalence',
      he_text: 'שקילות לוגית',
      parent: 'Introduction to Logic',
      prerequisite: 'Logical Operators',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Graph Theory',
      he_text: 'תורת הגרפים',
      course: 'Discrete Mathematics',
      prerequisite: 'Set Theory',
    },
    {
      en_text: 'Combinatorics',
      he_text: 'קומבינטוריקה',
      course: 'Discrete Mathematics',
      prerequisite: 'Set Theory',
    },
    {
      en_text: 'Permutation',
      he_text: 'תמורות',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Combinations',
      he_text: 'חליפות',
      parent: 'Combinatorics',
      prerequisite: 'Multiplication Principle',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Combinations with Repetitions',
      he_text: 'חליפות עם חזרות',
      parent: 'Combinatorics',
      prerequisite: 'Combinations',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Permutations',
      he_text: 'צירופים',
      parent: 'Combinatorics',
      prerequisite: 'Multiplication Principle',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Permutations with Repetitions',
      he_text: 'צירופים עם חזרות',
      parent: 'Combinatorics',
      prerequisite: 'Permutations',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Sum Principle',
      he_text: 'עקרון החיבור',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Multiplication Principle',
      he_text: 'עקרון הכפל',
      parent: 'Combinatorics',
      prerequisite: 'Sum Principle',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Pascal Triangle',
      he_text: 'משולש פסקל',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Binomial Formula',
      he_text: 'נוסחת הבינום',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Inclusion Principle',
      he_text: 'עקרון ההכלה',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Separation Principle',
      he_text: 'עקרון ההפרדה',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Mathematical Recursion',
      he_text: 'רקורסיה מטמטית',
      parent: 'Combinatorics',
      course: 'Discrete Mathematics',
    },
    {
      en_text: 'Prenex Normal Form',
      he_text: 'צורה נורמלית פרנקס',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Convergent Subsequences',
      he_text: 'תת-סדרות מתכנסות',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Rules of Inference',
      he_text: 'כללי היסק',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Reading Rules of Inference',
      he_text: 'קריאת כללי היסק',
      parent: 'Rules of Inference',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Modus Ponens',
      he_text: 'מודוס פוננס',
      parent: 'Rules of Inference',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Modus Tollens',
      he_text: 'מודוס טולנס',
      parent: 'Rules of Inference',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Truth Tables',
      he_text: 'טבלאות אמת',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Consistency and Satisfiability of Sets of Propositions',
      he_text: 'עקביות וסיפוק של קבוצות של טענות',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Axioms',
      he_text: 'אקסיומות',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Soundness and Completeness',
      he_text: 'נאותות ושלמות',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Quantifiers (∀, ∃)',
      he_text: 'כמתים (∀, ∃)',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text:
        'Quantifiers (∀, ∃) and their effect on formula complexity (rank/degree)',
      he_text: 'כמתים (∀, ∃) והשפעתם על מורכבות הנוסחה (דרגה/מעלה)',
      course: 'Logic for Computer Science Students',
    },
    {
      en_text: 'Cartesian Coordinate System',
      he_text: 'מערכת צירים קרטזית',
      courses: ['Calculus A', 'Infinitesimal Calculus 1'],
    },
    {
      en_text: 'Interval',
      he_text: 'אינטרוול',
      courses: ['Calculus A', 'Infinitesimal Calculus 1'],
    },
    {
      en_text: 'Absolute Value',
      he_text: 'ערך מוחלט',
      courses: ['Calculus A', 'Infinitesimal Calculus 1'],
    },
    {
      en_text: 'Properties of the Absolute Value',
      he_text: 'תכונות הערך המוחלט',
      parent: 'Absolute Value',
      courses: ['Calculus A', 'Infinitesimal Calculus 1'],
    },
    {
      en_text: 'Min Max Algorithm',
      he_text: 'אלגוריתם מינ-מקס',
      course: 'Artificial Intelligence',
    },
  ];

  for (const moduleData of modules) {
    // Note: Translations are now handled by bulk seedTranslations()
    // Find existing translation that should exist from bulk operation
    let translation = await cache.getTranslation(tx, moduleData.en_text);

    if (!translation) {
      // Get the pre-determined translation ID that should exist from bulk seeding
      const translationId = getModuleTranslationId(moduleData.en_text);
      translation = await tx.translation.findUnique({
        where: { id: translationId },
      });

      if (!translation) {
        throw new Error(
          `Translation for module "${moduleData.en_text}" not found. Expected ID: ${translationId}`,
        );
      }
    }

    const moduleId = moduleIds[moduleData.en_text];
    await tx.block.upsert({
      where: { id: moduleId },
      update: {},
      create: { id: moduleId },
    });

    let module = await tx.module.findFirst({
      where: { translationId: translation.id },
    });

    if (!module) {
      module = await tx.module.create({
        data: {
          id: moduleId,
          translationId: translation.id,
          blockId: moduleId,
        },
      });
    }

    if (moduleData.course) {
      const course = await tx.course.findFirst({
        where: {
          name: {
            en_text: moduleData.course,
          },
        },
      });
      if (course) {
        await tx.course.update({
          where: { id: course.id },
          data: { modules: { connect: { id: module.id } } },
        });
      }
    }

    if (moduleData.courses) {
      for (const courseName of moduleData.courses) {
        const course = await tx.course.findFirst({
          where: {
            name: {
              en_text: courseName,
            },
          },
        });
        if (course) {
          await tx.course.update({
            where: { id: course.id },
            data: { modules: { connect: { id: module.id } } },
          });
        }
      }
    }
  }

  for (const moduleData of modules) {
    if (moduleData.parent) {
      const parentModule = await tx.module.findFirst({
        where: { name: { en_text: moduleData.parent } },
        include: { name: true },
      });
      const childModule = await tx.module.findFirst({
        where: { name: { en_text: moduleData.en_text } },
        include: { name: true },
      });
      if (parentModule && childModule) {
        await tx.module.update({
          where: { id: parentModule.id },
          data: { subModules: { connect: { id: childModule.id } } },
        });
      }
    }

    if (moduleData.prerequisite) {
      const prerequisiteModule = await tx.module.findFirst({
        where: { name: { en_text: moduleData.prerequisite } },
        include: { name: true },
      });
      const postrequisiteModule = await tx.module.findFirst({
        where: { name: { en_text: moduleData.en_text } },
        include: { name: true },
      });
      if (prerequisiteModule && postrequisiteModule) {
        const relationshipId = getBlockRelationshipId(
          moduleData.prerequisite,
          moduleData.en_text,
        );
        const blockRelationship = await tx.blockRelationship.upsert({
          where: {
            id: relationshipId,
          },
          update: {},
          create: {
            id: relationshipId,
            prerequisiteId: prerequisiteModule.blockId,
            postrequisiteId: postrequisiteModule.blockId,
          },
        });
        const metadataId = getRelationshipMetadataId(blockRelationship.id);
        await tx.relationshipMetadata.upsert({
          where: {
            id: metadataId,
          },
          update: {
            value: 'hard',
          },
          create: {
            id: metadataId,
            blockRelationshipId: blockRelationship.id,
            key: 'TYPE',
            value: 'hard',
          },
        });
      }
    }
  }
};
