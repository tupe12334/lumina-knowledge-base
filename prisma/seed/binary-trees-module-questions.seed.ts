import {
  Prisma,
  QuestionType,
  QuestionValidationStatus,
} from '../../generated/client';
import { SeedCache } from './cache';

export const BINARY_TREES_IDS = {
  BINARY_TREES_MODULE: 'b2c3d4e5-6f7a-4b8c-9d0e-2f3a4b5c6d7e',
  QUESTION_1: 'c3d4e5f6-7a8b-4c9d-ae1f-3a4b5c6d7e8f',
  QUESTION_2: '2dc68715-fb53-4a01-8073-c8ba4e61ea16',
  QUESTION_3: '69436db6-a0b5-4ca0-9ce2-7209a1978e7b',
  QUESTION_4: '495c8aa0-7a24-4e76-9030-ec173ff61ec0',
  QUESTION_5: '6adaa932-4b1a-42d0-814b-d41d1b78696b',
  QUESTION_6: '25421649-83d1-4998-815f-262b90ab4c18',
  QUESTION_7: '9b03df50-b05e-482f-8d62-b2d62587d5a9',
  QUESTION_8: 'b86b487c-0629-4e23-b9fd-c361b9d6512d',
  QUESTION_9: 'f8923e57-b18b-4a38-8378-9aa4c63f7b76',
  QUESTION_10: '82de13b2-452e-454a-9fc3-4af74d7699c1',
};

/**
 * Seeds binary trees questions and their related data
 */
export const seedBinaryTreesQuestions = async (
  tx: Prisma.TransactionClient,
  cache: SeedCache,
): Promise<void> => {
  console.log('Seeding Binary Trees questions...');

  // Get the Binary Trees module
  const binaryTreesModule = await tx.module.findFirst({
    where: { name: { en_text: 'Binary Trees' } },
  });

  if (!binaryTreesModule) {
    console.error('Binary Trees module not found');
    return;
  }

  const questionsData = [
    {
      id: BINARY_TREES_IDS.QUESTION_1,
      translationId: 'c3d4e5f6-7a8b-4c9d-ae1f-3a4b5c6d7e8f',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: 'c3d4e5f6-7a8b-4c9d-ae1f-3a4b5c6d7e80',
          isCorrect: true,
          translationId: '7ac8c2ed-1b4f-4e7a-9d5e-8f3b2c4a1e6d',
        },
        {
          id: 'c3d4e5f6-7a8b-4c9d-ae1f-3a4b5c6d7e81',
          isCorrect: false,
          translationId: '9e2f4a1c-3d5e-4b7f-8a9d-1c2e3f4a5b6c',
        },
        {
          id: 'c3d4e5f6-7a8b-4c9d-ae1f-3a4b5c6d7e82',
          isCorrect: false,
          translationId: '1f3e5a7c-4b6d-4e8f-9a1c-2d3e4f5a6b7c',
        },
        {
          id: 'c3d4e5f6-7a8b-4c9d-ae1f-3a4b5c6d7e83',
          isCorrect: false,
          translationId: '2a4c6e8f-5b7d-4f9a-8c1e-3d4e5f6a7b8c',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_2,
      translationId: '5c306faf-da15-4565-8ea1-3178eaf6295c',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: 'd4e5f6a7-8b9c-4dae-af2a-4b5c6d7e8f90',
          isCorrect: true,
          translationId: '3b5d7f9a-6c8e-4a1c-9d2e-4e5f6a7b8c9d',
        },
        {
          id: 'd4e5f6a7-8b9c-4dae-af2a-4b5c6d7e8f91',
          isCorrect: false,
          translationId: '4c6e8a1c-7d9f-4b2d-8e1f-5f6a7b8c9d1e',
        },
        {
          id: 'd4e5f6a7-8b9c-4dae-af2a-4b5c6d7e8f92',
          isCorrect: false,
          translationId: '5d7f9b2e-8e1a-4c3e-9f2a-6a7b8c9d1e2f',
        },
        {
          id: 'd4e5f6a7-8b9c-4dae-af2a-4b5c6d7e8f93',
          isCorrect: false,
          translationId: '6e8a1c3f-9f2b-4d4f-8a3b-7b8c9d1e2f3a',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_3,
      translationId: '605f5cf0-b1b4-483e-8238-965d9f00fe79',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: 'e5f6a7b8-9cad-4e1f-aa3b-5c6d7e8f9aa0',
          isCorrect: true,
          translationId: '7f9c1e3a-ad2f-4e5a-9b4c-8c9d1e2f3a4b',
        },
        {
          id: 'e5f6a7b8-9cad-4e1f-aa3b-5c6d7e8f9aa1',
          isCorrect: false,
          translationId: '8aad2f3b-1e4c-4f6b-ac5d-9d1e2f3a4b5c',
        },
        {
          id: 'e5f6a7b8-9cad-4e1f-aa3b-5c6d7e8f9aa2',
          isCorrect: false,
          translationId: '9b1e3c4d-2f5e-4a7c-ad6e-ae2f3a4b5c6d',
        },
        {
          id: 'e5f6a7b8-9cad-4e1f-aa3b-5c6d7e8f9aa3',
          isCorrect: false,
          translationId: 'ac2f4d5e-3a6f-418d-ae7f-1f3a4b5c6d7e',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_4,
      translationId: 'faabf48f-eef5-47a6-bbe3-20615e00b949',
      type: QuestionType.value,
      validationStatus: QuestionValidationStatus.ai_generated,
    },
    {
      id: BINARY_TREES_IDS.QUESTION_5,
      translationId: '19dc9227-4988-4dea-ac7f-ecf2790939be',
      type: QuestionType.value,
      validationStatus: QuestionValidationStatus.ai_generated,
    },
    {
      id: BINARY_TREES_IDS.QUESTION_6,
      translationId: 'af462c40-e3de-4d87-94ec-61b30cf74b0a',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: 'b8c9daeb-2f3a-4b5c-ad7e-8f9aab1c2d30',
          isCorrect: true,
          translationId: '1d3f5a7c-4e6b-417e-ab5c-2f3a4b5c6d7e',
        },
        {
          id: 'b8c9daeb-2f3a-4b5c-ad7e-8f9aab1c2d31',
          isCorrect: false,
          translationId: '2e4a6b8d-5f7c-428f-ac6d-3a4b5c6d7e8f',
        },
        {
          id: 'b8c9daeb-2f3a-4b5c-ad7e-8f9aab1c2d32',
          isCorrect: false,
          translationId: '3f5b7c9e-6a8d-439a-ad7e-4b5c6d7e8f9a',
        },
        {
          id: 'b8c9daeb-2f3a-4b5c-ad7e-8f9aab1c2d33',
          isCorrect: false,
          translationId: '4a6c8eaa-7b9e-44ab-ae8f-5c6d7e8f9aab',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_7,
      translationId: '9a0e4a96-cf76-4a28-821c-5fb8f0084785',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: 'c9dae1f2-3a4b-4c6d-ae8f-9aab1c2d3e40',
          isCorrect: true,
          translationId: '5b7d9f1b-8caf-45bc-af9a-8d7e8f9aab1c',
        },
        {
          id: 'c9dae1f2-3a4b-4c6d-ae8f-9aab1c2d3e41',
          isCorrect: false,
          translationId: '6c8eaa2c-9d1a-46cd-aaab-8e8f9aab1c2d',
        },
        {
          id: 'c9dae1f2-3a4b-4c6d-ae8f-9aab1c2d3e42',
          isCorrect: false,
          translationId: '7d9f1b3d-ae2b-47de-ab1c-8f9aab1c2d3e',
        },
        {
          id: '5030698c-1039-4f63-822b-8a3f4c6b22cc',
          isCorrect: false,
          translationId: '744e652c-6228-42ea-bbaf-6d3b65eac599',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_8,
      translationId: '50e36d06-19a2-4cb6-863a-5fdef2ea2540',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: '04219dac-ec85-46e9-9804-252d72ed23cf',
          isCorrect: true,
          translationId: '9f1b3d5f-2a4d-49fa-8d3e-aab1c2d3e4f5',
        },
        {
          id: '178dbf9f-1e82-473e-aab4-721a492c2f6c',
          isCorrect: false,
          translationId: 'aa2c4e6a-3b5e-4aab-9e4f-1c2d3e4f5a6b',
        },
        {
          id: 'bdf9817f-1d0c-41d6-a53c-6b5e8d6a0cf6',
          isCorrect: false,
          translationId: '1b3d5f7b-4c6f-41bc-af5a-2d3e4f5a6b7c',
        },
        {
          id: 'a06bc9e9-bb04-4ac9-a600-bb0f6d06405f',
          isCorrect: false,
          translationId: '75f031c8-3a7d-4f09-8e5d-d71144e158b4',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_9,
      translationId: '2f84d3c7-afe7-4d19-95dd-38549ac65c8a',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: 'd6d68760-b4ac-4aa8-9350-9303279086e0',
          isCorrect: true,
          translationId: '3a1fcd00-cd75-4323-8d58-963090db7050',
        },
        {
          id: 'a2dd8216-ab98-4efc-b42c-4928536902bc',
          isCorrect: false,
          translationId: 'b112b915-bbf4-41b8-95fd-a5de8f46c6a0',
        },
        {
          id: '17908a34-3f34-4b06-9057-d334a7e8bfa1',
          isCorrect: false,
          translationId: 'df58ff41-22d8-404c-8634-f3ad318283c3',
        },
        {
          id: '0066f21c-74e6-4062-833d-3a1eb49d8981',
          isCorrect: false,
          translationId: '9264b4da-613a-4e62-80a6-3e1f310c1cea',
        },
      ],
    },
    {
      id: BINARY_TREES_IDS.QUESTION_10,
      translationId: '8dbf7dcd-250f-43ff-904e-d090a176b88a',
      type: QuestionType.selection,
      validationStatus: QuestionValidationStatus.ai_generated,
      answers: [
        {
          id: '0a98f353-940c-4d71-a46a-9a823e35353b',
          isCorrect: true,
          translationId: '568d3865-6b1c-43ae-8bd2-44540d924b4b',
        },
        {
          id: '966560a8-aca3-4831-bf73-762530d77d93',
          isCorrect: false,
          translationId: 'cbfe4480-dfeb-4bd5-864e-47494e1fd6df',
        },
        {
          id: '5728f7a8-2aa4-49e7-a492-0483bbd2288b',
          isCorrect: false,
          translationId: '9d1f3b5d-2e4b-49de-8b3c-af1a2b3c4d5e',
        },
        {
          id: '353da9a0-2b1a-4b79-a074-8c80bd330bdb',
          isCorrect: false,
          translationId: 'ae2a4c6e-3f5c-4aef-9c4d-1a2b3c4d5e6f',
        },
      ],
    },
  ];

  // Seed questions and answers
  for (const questionData of questionsData) {
    await tx.question.upsert({
      where: { id: questionData.id },
      update: {
        Modules: { connect: [{ id: binaryTreesModule.id }] },
      },
      create: {
        id: questionData.id,
        translationId: questionData.translationId,
        type: questionData.type,
        validationStatus: questionData.validationStatus,
        Modules: { connect: [{ id: binaryTreesModule.id }] },
      },
    });

    // Seed answers for selection questions
    if (questionData.answers) {
      for (const answerData of questionData.answers) {
        await tx.selectAnswer.upsert({
          where: { id: answerData.id },
          update: {},
          create: {
            id: answerData.id,
            answerId: questionData.id,
            isCorrect: answerData.isCorrect,
            translationId: answerData.translationId,
          },
        });
      }
    }
  }

  console.log('Binary Trees questions seeded successfully.');
};
