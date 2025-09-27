import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { AnswersQueryDto } from '../dto/answers-query.dto';

@Injectable()
export class AnswersQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query?: AnswersQueryDto) {
    return this.prisma.answer.findMany({
      where: {
        ...(query && query.questionId ? { questionId: query.questionId } : {}),
      },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });
  }

  async findUnique(id: string) {
    return this.prisma.answer.findUnique({
      where: { id },
      include: {
        SelectAnswer: { include: { text: true } },
        UnitAnswer: true,
        NumberAnswer: true,
      },
    });
  }
}