import { Injectable, NotFoundException } from '@nestjs/common';
import { Units } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateSelectAnswerInputItem } from '../dto/update-select-answer-input-item';

@Injectable()
export class AnswersUpdateService {
  constructor(private readonly prisma: PrismaService) {}

  async validateQuestionExists(questionId: string) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }
  }

  async updateSelectAnswers(answerId: string, selectAnswers: UpdateSelectAnswerInputItem[]) {
    const current = await this.prisma.selectAnswer.findMany({
      where: { answerId },
    });

    await this.prisma.selectAnswer.deleteMany({
      where: { answerId },
    });

    if (selectAnswers && selectAnswers.length > 0) {
      await this.prisma.selectAnswer.createMany({
        data: selectAnswers.map((s) => ({
          isCorrect: s.isCorrect ?? false,
          answerId,
          translationId: s.translationId!,
        })),
      });
    }
  }

  async updateUnitAnswer(answerId: string, unitValue?: number, unit?: Units) {
    await this.prisma.numberAnswer.deleteMany({ where: { answerId } });
    const existingUnit = await this.prisma.unitAnswer.findUnique({
      where: { answerId },
    });
    if (existingUnit) {
      await this.prisma.unitAnswer.update({
        where: { answerId },
        data: { value: unitValue, unit: unit },
      });
    } else if (unitValue != null && unit != null) {
      await this.prisma.unitAnswer.create({
        data: { value: unitValue, unit: unit, answerId },
      });
    }
  }

  async updateNumberAnswer(answerId: string, numberAnswer?: number) {
    await this.prisma.unitAnswer.deleteMany({ where: { answerId } });
    const existingNumber = await this.prisma.numberAnswer.findUnique({
      where: { answerId },
    });
    if (existingNumber) {
      await this.prisma.numberAnswer.update({
        where: { answerId },
        data: { value: numberAnswer },
      });
    } else {
      await this.prisma.numberAnswer.create({
        data: { value: numberAnswer!, answerId },
      });
    }
  }
}