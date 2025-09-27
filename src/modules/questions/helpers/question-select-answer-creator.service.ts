import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionSelectAnswerCreatorService {
  async createSelectAnswers(
    prisma: Prisma.TransactionClient,
    questionId: string,
    selectAnswers: Array<{
      en_text: string;
      he_text: string;
      is_correct: boolean;
    }>,
  ) {
    const answerTranslations = await Promise.all(
      selectAnswers.map((answer) =>
        prisma.translation.create({
          data: {
            en_text: answer.en_text,
            he_text: answer.he_text,
          },
        }),
      ),
    );

    await prisma.answer.create({
      data: {
        question: { connect: { id: questionId } },
        SelectAnswer: {
          create: selectAnswers.map((answer, index) => {
            if (index < 0 || index >= answerTranslations.length) {
              throw new BadRequestException(
                `Invalid index ${index} for answerTranslations array`,
              );
            }
            const translation = answerTranslations.at(index);
            if (!translation) {
              throw new BadRequestException(
                `Missing translation for answer at index ${index}`,
              );
            }
            return {
              isCorrect: answer.is_correct,
              text: { connect: { id: translation.id } },
            };
          }),
        },
      },
    });
  }
}