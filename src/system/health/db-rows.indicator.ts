import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

interface CountableDelegate {
  count: () => Promise<number>;
}

interface PrismaCountClient {
  institution: CountableDelegate;
  faculty: CountableDelegate;
  degree: CountableDelegate;
  course: CountableDelegate;
  module: CountableDelegate;
  block: CountableDelegate;
  blockRelationship: CountableDelegate;
  relationshipMetadata: CountableDelegate;
  translation: CountableDelegate;
  question: CountableDelegate;
  questionPart: CountableDelegate;
  answer: CountableDelegate;
  selectAnswer: CountableDelegate;
  unitAnswer: CountableDelegate;
  numberAnswer: CountableDelegate;
}

@Injectable()
export class DbRowsHealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(
    key = 'db_rows',
    minRows = 100,
  ): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    const delegates: CountableDelegate[] = [
      this.prisma.institution,
      this.prisma.faculty,
      this.prisma.degree,
      this.prisma.course,
      this.prisma.module,
      this.prisma.block,
      this.prisma.blockRelationship,
      this.prisma.relationshipMetadata,
      this.prisma.translation,
      this.prisma.question,
      this.prisma.questionPart,
      this.prisma.answer,
      this.prisma.selectAnswer,
      this.prisma.unitAnswer,
      this.prisma.numberAnswer,
    ];

    const counts = await Promise.all(delegates.map((d) => d.count()));
    const totalRows = counts.reduce((a, b) => a + b, 0);

    const isUp = totalRows > minRows;

    if (isUp) {
      return indicator.up({
        totalRows,
        minRequired: minRows,
      });
    }

    return indicator.down({
      totalRows,
      minRequired: minRows,
    });
  }
}
