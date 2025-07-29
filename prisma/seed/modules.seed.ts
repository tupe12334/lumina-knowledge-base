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
    let translation = await cache.getTranslation(tx, moduleData.en_text);

    if (!translation) {
      const translationId = getModuleTranslationId(moduleData.en_text);
      translation = await tx.translation.create({
        data: {
          ...(translationId ? { id: translationId } : {}),
          en_text: moduleData.en_text,
          he_text: moduleData.he_text,
        },
      });
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
            prerequisiteId_postrequisiteId: {
              prerequisiteId: prerequisiteModule.blockId,
              postrequisiteId: postrequisiteModule.blockId,
            },
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
            key_blockRelationshipId: {
              key: 'TYPE',
              blockRelationshipId: blockRelationship.id,
            },
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
