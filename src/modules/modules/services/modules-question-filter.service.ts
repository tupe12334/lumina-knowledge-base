import { Injectable } from '@nestjs/common';
import { ModulesQueryDto } from '../dto/modules-query.dto';

type ModuleWithCount = any & { _count: { Questions: number } };

@Injectable()
export class ModulesQuestionFilterService {
  passesQuestionFilters(
    module: ModuleWithCount,
    filters: ModulesQueryDto,
  ): boolean {
    const questionCount = module._count.Questions;

    if (!this.passesExactQuestionFilter(questionCount, filters)) {
      return false;
    }

    if (!this.passesMinMaxQuestionFilter(questionCount, filters)) {
      return false;
    }

    if (!this.passesHasQuestionsFilter(questionCount, filters)) {
      return false;
    }

    if (!this.passesFewQuestionsFilter(questionCount, filters)) {
      return false;
    }

    return true;
  }

  private passesExactQuestionFilter(
    questionCount: number,
    filters: ModulesQueryDto,
  ): boolean {
    if (filters.exactQuestions !== undefined) {
      return questionCount === filters.exactQuestions;
    }
    return true;
  }

  private passesMinMaxQuestionFilter(
    questionCount: number,
    filters: ModulesQueryDto,
  ): boolean {
    if (filters.exactQuestions !== undefined) {
      return true;
    }

    const meetsMinRequirement =
      filters.minQuestions === undefined ||
      questionCount >= filters.minQuestions;

    const meetsMaxRequirement =
      filters.maxQuestions === undefined ||
      questionCount <= filters.maxQuestions;

    return meetsMinRequirement && meetsMaxRequirement;
  }

  private passesHasQuestionsFilter(
    questionCount: number,
    filters: ModulesQueryDto,
  ): boolean {
    if (filters.hasQuestions !== undefined) {
      const hasQuestions = questionCount > 0;
      return hasQuestions === filters.hasQuestions;
    }
    return true;
  }

  private passesFewQuestionsFilter(
    questionCount: number,
    filters: ModulesQueryDto,
  ): boolean {
    if (filters.fewQuestions !== undefined) {
      const hasFewQuestions = questionCount < 20;
      return hasFewQuestions === filters.fewQuestions;
    }
    return true;
  }
}