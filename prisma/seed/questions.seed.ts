import {
  Prisma,
  QuestionType,
  QuestionValidationStatus,
} from '../../generated/client';
import { QUESTIONS } from './questions.consts';

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
    numberAnswer?: Prisma.NumberAnswerUncheckedCreateWithoutAnswerInput;
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
        numberAnswer?: Prisma.NumberAnswerUncheckedCreateWithoutAnswerInput;
      }[];
    };
  }[];
};

export async function seedQuestions(tx: Prisma.TransactionClient) {
  for (const questionData of QUESTIONS) {
    const {
      id,
      translationId,
      text,
      type,
      validationStatus,
      moduleId,
      answers,
      parts,
    } = questionData;

    const translation = await tx.translation.upsert({
      where: { id: translationId },
      update: { en_text: text.en_text, he_text: text.he_text },
      create: {
        id: translationId,
        en_text: text.en_text,
        he_text: text.he_text,
      },
    });

    // Use upsert to avoid transaction errors
    const question = await tx.question.upsert({
      where: { id },
      update: {
        text: { connect: { id: translation.id } },
        type: type,
        validationStatus: validationStatus,
        Modules: { set: [{ id: moduleId }] },
      },
      create: {
        id,
        text: { connect: { id: translation.id } },
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
        const partTranslation = await tx.translation.upsert({
          where: { id: partData.partQuestion.translationId },
          update: {
            en_text: partData.partQuestion.text.en_text,
            he_text: partData.partQuestion.text.he_text,
          },
          create: {
            id: partData.partQuestion.translationId,
            en_text: partData.partQuestion.text.en_text,
            he_text: partData.partQuestion.text.he_text,
          },
        });

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
                value: numberAnswer.value,
                answer: { connect: { id: answer.id } },
              },
              create: {
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
            value: numberAnswer.value,
            answer: { connect: { id: answer.id } },
          },
          create: {
            value: numberAnswer.value,
            answer: { connect: { id: answer.id } },
          },
        });
      }
    }
  }
}
