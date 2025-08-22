#!/usr/bin/env tsx
/**
 * Data migration script to convert existing Yes/No and True/False questions 
 * from 'selection' type to 'boolean' type with BooleanAnswer records.
 * 
 * This script will:
 * 1. Find all selection questions with exactly 2 answers that are Yes/No or True/False
 * 2. Convert them to boolean type
 * 3. Create BooleanAnswer records based on the correct answer
 * 4. Remove the old SelectAnswer records
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface QuestionToMigrate {
  id: string;
  correctAnswerValue: boolean;
  answerIds: string[];
  selectAnswerIds: string[];
}

async function findQuestionsToMigrate(): Promise<QuestionToMigrate[]> {
  console.log('🔍 Finding questions to migrate...');
  
  // Find all selection questions with exactly 2 answers
  const questions = await prisma.question.findMany({
    where: {
      type: 'selection',
    },
    include: {
      Answer: {
        include: {
          SelectAnswer: {
            include: {
              text: true,
            },
          },
        },
      },
    },
  });

  const questionsToMigrate: QuestionToMigrate[] = [];

  for (const question of questions) {
    for (const answer of question.Answer) {
      // Check if this answer has exactly 2 select options
      if (answer.SelectAnswer.length === 2) {
        const options = answer.SelectAnswer.map(sa => ({
          id: sa.id,
          text: sa.text.en_text.toLowerCase(),
          isCorrect: sa.isCorrect,
        }));

        // Check if it's a yes/no question
        const isYesNoQuestion = 
          options.some(opt => opt.text === 'yes') && 
          options.some(opt => opt.text === 'no');

        // Check if it's a true/false question  
        const isTrueFalseQuestion = 
          options.some(opt => opt.text === 'true') && 
          options.some(opt => opt.text === 'false');

        if (isYesNoQuestion || isTrueFalseQuestion) {
          // Determine the correct boolean value
          let correctAnswerValue: boolean;
          
          if (isYesNoQuestion) {
            const correctOption = options.find(opt => opt.isCorrect);
            correctAnswerValue = correctOption?.text === 'yes';
          } else {
            const correctOption = options.find(opt => opt.isCorrect);
            correctAnswerValue = correctOption?.text === 'true';
          }

          questionsToMigrate.push({
            id: question.id,
            correctAnswerValue,
            answerIds: [answer.id],
            selectAnswerIds: options.map(opt => opt.id),
          });
          
          console.log(`  ✅ Found question "${question.id}" - correct answer: ${correctAnswerValue}`);
        }
      }
    }
  }

  return questionsToMigrate;
}

async function migrateQuestions(questions: QuestionToMigrate[]): Promise<void> {
  console.log(`\n🔄 Migrating ${questions.length} questions...`);

  for (const question of questions) {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Update question type to boolean
        await tx.question.update({
          where: { id: question.id },
          data: { type: 'boolean' },
        });

        // 2. Create BooleanAnswer for each answer
        for (const answerId of question.answerIds) {
          await tx.booleanAnswer.create({
            data: {
              value: question.correctAnswerValue,
              answerId: answerId,
            },
          });
        }

        // 3. Delete old SelectAnswer records
        await tx.selectAnswer.deleteMany({
          where: {
            id: { in: question.selectAnswerIds },
          },
        });

        console.log(`  ✅ Migrated question ${question.id}`);
      });
    } catch (error) {
      console.error(`  ❌ Failed to migrate question ${question.id}:`, error);
      throw error;
    }
  }
}

async function validateMigration(questions: QuestionToMigrate[]): Promise<void> {
  console.log('\n🔍 Validating migration...');

  for (const question of questions) {
    // Check that question type was updated
    const updatedQuestion = await prisma.question.findUnique({
      where: { id: question.id },
      include: {
        Answer: {
          include: {
            BooleanAnswer: true,
            SelectAnswer: true,
          },
        },
      },
    });

    if (!updatedQuestion) {
      throw new Error(`Question ${question.id} not found after migration`);
    }

    if (updatedQuestion.type !== 'boolean') {
      throw new Error(`Question ${question.id} type not updated to boolean`);
    }

    // Check that BooleanAnswer was created correctly
    for (const answer of updatedQuestion.Answer) {
      if (!answer.BooleanAnswer) {
        throw new Error(`BooleanAnswer not created for answer ${answer.id}`);
      }

      if (answer.BooleanAnswer.value !== question.correctAnswerValue) {
        throw new Error(`BooleanAnswer value incorrect for answer ${answer.id}`);
      }

      // Check that SelectAnswer was removed
      if (answer.SelectAnswer.length > 0) {
        throw new Error(`SelectAnswer not removed for answer ${answer.id}`);
      }
    }

    console.log(`  ✅ Question ${question.id} validated`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting boolean questions migration...\n');

    // Find questions to migrate
    const questionsToMigrate = await findQuestionsToMigrate();

    if (questionsToMigrate.length === 0) {
      console.log('No questions found to migrate. Exiting.');
      return;
    }

    console.log(`Found ${questionsToMigrate.length} questions to migrate.`);

    // Ask for confirmation
    console.log('\n⚠️  This will modify your database. Are you sure you want to continue?');
    console.log('Press Ctrl+C to cancel, or continue...\n');

    // Migrate questions
    await migrateQuestions(questionsToMigrate);

    // Validate migration
    await validateMigration(questionsToMigrate);

    console.log(`\n🎉 Successfully migrated ${questionsToMigrate.length} questions to boolean type!`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
main();