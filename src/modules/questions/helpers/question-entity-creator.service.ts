import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCompleteQuestionInput } from '../dto/create-complete-question.input';

@Injectable()
export class QuestionEntityCreatorService {
  async createQuestionWithTranslation(
    prisma: Prisma.TransactionClient,
    questionData: CreateCompleteQuestionInput,
  ) {
    const {
      en_text,
      he_text,
      type,
      moduleIds,
      validationStatus,
    } = questionData;

    if (!validationStatus) {
      throw new BadRequestException(
        'validationStatus is required for question creation',
      );
    }

    const translation = await prisma.translation.create({
      data: { en_text, he_text },
    });

    const question = await prisma.question.create({
      data: {
        type,
        validationStatus,
        text: { connect: { id: translation.id } },
        Modules: {
          connect: moduleIds
            ? moduleIds.map((id: string) => ({ id }))
            : undefined,
        },
      },
    });

    return question;
  }
}