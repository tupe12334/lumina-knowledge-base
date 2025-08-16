import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma/prisma.service';

interface CountableDelegate {
  count: () => Promise<number>;
}

export interface PrismaCountClient {
  university: CountableDelegate;
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
  learningResource: CountableDelegate;
}

@Injectable()
export class DbRowsHealthIndicator extends HealthIndicator {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async isHealthy(
    key = 'db_rows',
    minRows = 100,
  ): Promise<HealthIndicatorResult> {
    const delegates: CountableDelegate[] = [
      this.prisma.university,
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
      this.prisma.learningResource,
    ];

    const counts = await Promise.all(delegates.map((d) => d.count()));
    const totalRows = counts.reduce((a, b) => a + b, 0);

    const isUp = totalRows > minRows;
    const result = this.getStatus(key, isUp, {
      totalRows,
      minRequired: minRows,
    });
    if (isUp) return result;
    throw new HealthCheckError(key, result);
  }
}
