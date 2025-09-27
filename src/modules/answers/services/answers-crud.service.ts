import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateAnswerInput } from '../dto/update-answer.input';
import { AnswersUpdateService } from './answers-update.service';

@Injectable()
export class AnswersCrudService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly updateService: AnswersUpdateService,
  ) {}

  async update(data: UpdateAnswerInput) {
    const { id, questionId, selectAnswers, unitValue, unit, numberAnswer } = data;

    const exists = await this.prisma.answer.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException(`Answer with ID ${id} not found`);

    if (questionId) {
      await this.updateService.validateQuestionExists(questionId);
    }

    if (selectAnswers) {
      await this.updateService.updateSelectAnswers(id, selectAnswers);
    }

    if (unitValue != null || unit != null) {
      await this.updateService.updateUnitAnswer(id, unitValue, unit);
    } else if (numberAnswer != null) {
      await this.updateService.updateNumberAnswer(id, numberAnswer);
    }

    const updated = await this.prisma.answer.update({
      where: { id },
      data: {
        ...(questionId ? { question: { connect: { id: questionId } } } : {}),
      },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });

    return updated;
  }

  async delete(id: string) {
    return this.prisma.answer.delete({
      where: { id },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });
  }
}