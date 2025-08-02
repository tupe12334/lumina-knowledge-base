import {
  Prisma,
  QuestionType,
  QuestionValidationStatus,
} from '../../generated/client';
import { QUESTIONS } from './questions.consts';
import { SeedCache } from './cache';

export type QuestionSeedData = {
  id: string;
  translationId: string;
  text: Prisma.TranslationUncheckedCreateInput;
  type: QuestionType;
  validationStatus?: QuestionValidationStatus;
  moduleId: string;
  answers: {
    id: string;
    selectAnswers?: {
      id: string;
      translationId: string;
      text: Prisma.TranslationUncheckedCreateInput;
      isCorrect: boolean;
    }[];
    unitAnswer?: Prisma.UnitAnswerUncheckedCreateWithoutAnswerInput;
    numberAnswer?: Prisma.NumberAnswerUncheckedCreateWithoutAnswerInput & {
      id: string;
    };
  }[];
  parts?: {
    id: string;
    order: number;
    partQuestion: {
      id: string;
      translationId: string;
      text: Prisma.TranslationUncheckedCreateInput;
      type: QuestionType;
      moduleId: string;
      answers: {
        id: string;
        selectAnswers?: {
          id: string;
          translationId: string;
          text: Prisma.TranslationUncheckedCreateInput;
          isCorrect: boolean;
        }[];
        unitAnswer?: Prisma.UnitAnswerUncheckedCreateWithoutAnswerInput;
        numberAnswer?: Prisma.NumberAnswerUncheckedCreateWithoutAnswerInput & {
          id: string;
        };
      }[];
    };
  }[];
};

export async function seedQuestions(
  tx: Prisma.TransactionClient,
  cache: SeedCache,
) {
  // Collect all translation texts for batch preloading
  const allTranslationTexts = new Set<string>();

  for (const questionData of QUESTIONS) {
    // Add main question text
    allTranslationTexts.add(questionData.text.en_text);

    // Add answer texts
    for (const answer of questionData.answers) {
      if (answer.selectAnswers) {
        for (const selectAnswer of answer.selectAnswers) {
          allTranslationTexts.add(selectAnswer.text.en_text);
        }
      }
    }

    // Add part question texts
    if (questionData.parts) {
      for (const part of questionData.parts) {
        allTranslationTexts.add(part.partQuestion.text.en_text);
        for (const answer of part.partQuestion.answers) {
          if (answer.selectAnswers) {
            for (const selectAnswer of answer.selectAnswers) {
              allTranslationTexts.add(selectAnswer.text.en_text);
            }
          }
        }
      }
    }
  }

  // Batch preload all translations for optimal performance
  await cache.preloadTranslations(tx, Array.from(allTranslationTexts));

  for (const questionData of QUESTIONS) {
    const { id, text, type, validationStatus, moduleId, answers, parts } =
      questionData;

    const questionTranslationId = await cache.getTranslation(tx, text.en_text);
    if (!questionTranslationId) {
      throw new Error(
        `Translation not found for question: "${text.en_text}" / "${text.he_text}"`,
      );
    }

    // Use upsert to avoid transaction errors
    const question = await tx.question.upsert({
      where: { id },
      update: {
        text: { connect: { id: questionTranslationId.id } },
        type: type,
        validationStatus: validationStatus,
        Modules: { set: [{ id: moduleId }] },
      },
      create: {
        id,
        text: { connect: { id: questionTranslationId.id } },
        type: type,
        validationStatus: validationStatus,
        Modules: { connect: [{ id: moduleId }] },
      },
    });

    if (!question) {
      throw new Error(`Failed to create or find question with id ${id}`);
    }

    // Handle question parts if they exist
    if (parts && parts.length > 0) {
      for (const partData of parts) {
        // First create the part question
        const partTranslation = await cache.getTranslation(
          tx,
          partData.partQuestion.text.en_text,
        );
        if (!partTranslation) {
          throw new Error(
            `Translation not found for part question: "${partData.partQuestion.text.en_text}"`,
          );
        }

        const partQuestion = await tx.question.upsert({
          where: { id: partData.partQuestion.id },
          update: {
            text: { connect: { id: partTranslation.id } },
            type: partData.partQuestion.type,
            Modules: { set: [{ id: partData.partQuestion.moduleId }] },
          },
          create: {
            id: partData.partQuestion.id,
            text: { connect: { id: partTranslation.id } },
            type: partData.partQuestion.type,
            Modules: { connect: [{ id: partData.partQuestion.moduleId }] },
          },
        });

        // Create the part question answers
        for (const answerData of partData.partQuestion.answers) {
          const {
            id: answerId,
            selectAnswers,
            unitAnswer,
            numberAnswer,
          } = answerData;

          const answer = await tx.answer.upsert({
            where: { id: answerId },
            update: {
              question: { connect: { id: partQuestion.id } },
            },
            create: {
              id: answerId,
              question: { connect: { id: partQuestion.id } },
            },
          });

          if (selectAnswers) {
            for (const selectAnswerData of selectAnswers) {
              // Create translation for the select answer
              const selectAnswerTranslation = await cache.getTranslation(
                tx,
                selectAnswerData.text.en_text,
              );
              if (!selectAnswerTranslation) {
                throw new Error(
                  `Translation not found for select answer: "${selectAnswerData.text.en_text}"`,
                );
              }

              await tx.selectAnswer.upsert({
                where: { id: selectAnswerData.id },
                update: {
                  text: { connect: { id: selectAnswerTranslation.id } },
                  isCorrect: selectAnswerData.isCorrect,
                  answer: { connect: { id: answer.id } },
                },
                create: {
                  id: selectAnswerData.id,
                  text: { connect: { id: selectAnswerTranslation.id } },
                  isCorrect: selectAnswerData.isCorrect,
                  answer: { connect: { id: answer.id } },
                },
              });
            }
          } else if (unitAnswer) {
            await tx.unitAnswer.upsert({
              where: { answerId: answer.id },
              update: {
                value: unitAnswer.value,
                unit: unitAnswer.unit,
                answer: { connect: { id: answer.id } },
              },
              create: {
                value: unitAnswer.value,
                unit: unitAnswer.unit,
                answer: { connect: { id: answer.id } },
              },
            });
          } else if (numberAnswer) {
            await tx.numberAnswer.upsert({
              where: { answerId: answer.id },
              update: {
                id: numberAnswer.id,
                value: numberAnswer.value,
                answer: { connect: { id: answer.id } },
              },
              create: {
                id: numberAnswer.id,
                value: numberAnswer.value,
                answer: { connect: { id: answer.id } },
              },
            });
          }
        }

        // Now create the QuestionPart that links the main question to the part question
        await tx.questionPart.upsert({
          where: { id: partData.id },
          update: {
            order: partData.order,
            questionId: question.id,
            partQuestionId: partQuestion.id,
          },
          create: {
            id: partData.id,
            order: partData.order,
            questionId: question.id,
            partQuestionId: partQuestion.id,
          },
        });
      }
    }

    // Handle main question answers
    for (const answerData of answers) {
      const {
        id: answerId,
        selectAnswers,
        unitAnswer,
        numberAnswer,
      } = answerData;

      const answer = await tx.answer.upsert({
        where: { id: answerId },
        update: {
          question: { connect: { id: question.id } },
        },
        create: {
          id: answerId,
          question: { connect: { id: question.id } },
        },
      });

      if (selectAnswers) {
        for (const selectAnswerData of selectAnswers) {
          // Create translation for the select answer
          const selectAnswerTranslation = await cache.getTranslation(
            tx,
            selectAnswerData.text.en_text,
          );
          if (!selectAnswerTranslation) {
            throw new Error(
              `Translation not found for select answer: "${selectAnswerData.text.en_text}"`,
            );
          }

          await tx.selectAnswer.upsert({
            where: { id: selectAnswerData.id },
            update: {
              text: { connect: { id: selectAnswerTranslation.id } },
              isCorrect: selectAnswerData.isCorrect,
              answer: { connect: { id: answer.id } },
            },
            create: {
              id: selectAnswerData.id,
              text: { connect: { id: selectAnswerTranslation.id } },
              isCorrect: selectAnswerData.isCorrect,
              answer: { connect: { id: answer.id } },
            },
          });
        }
      } else if (unitAnswer) {
        await tx.unitAnswer.upsert({
          where: { answerId: answer.id },
          update: {
            value: unitAnswer.value,
            unit: unitAnswer.unit,
            answer: { connect: { id: answer.id } },
          },
          create: {
            value: unitAnswer.value,
            unit: unitAnswer.unit,
            answer: { connect: { id: answer.id } },
          },
        });
      } else if (numberAnswer) {
        await tx.numberAnswer.upsert({
          where: { answerId: answer.id },
          update: {
            id: numberAnswer.id,
            value: numberAnswer.value,
            answer: { connect: { id: answer.id } },
          },
          create: {
            id: numberAnswer.id,
            value: numberAnswer.value,
            answer: { connect: { id: answer.id } },
          },
        });
      }
    }
  }
}
