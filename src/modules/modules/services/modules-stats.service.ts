import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ModulesStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getModulesSummary(): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    const modules = await this.prisma.module.findMany({
      include: {
        name: true,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    return modules
      .map((module) => ({
        id: module.id,
        en_name: module.name.en_text,
        questions_amount: module._count.Questions,
      }))
      .sort((a, b) => a.questions_amount - b.questions_amount);
  }

  async getModulesByQuestionCount(limit?: number): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    const modules = await this.prisma.module.findMany({
      include: {
        name: true,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    const sortedModules = modules
      .map((module) => ({
        id: module.id,
        en_name: module.name.en_text,
        questions_amount: module._count.Questions,
      }))
      .sort((a, b) => a.questions_amount - b.questions_amount);

    return limit ? sortedModules.slice(0, limit) : sortedModules;
  }
}