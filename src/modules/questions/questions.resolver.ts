import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryInput } from './dto/questions-query.input';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Query(() => [Question], { name: 'questions' })
  async getQuestions(
    @Args('input', { nullable: true }) input?: QuestionsQueryInput,
  ): Promise<Question[]> {
    // Convert GraphQL input to the existing DTO format, handling both array and single values
    const query = input
      ? {
          // Use new array fields if provided, otherwise fallback to single values
          moduleIds:
            input.moduleIds || (input.moduleId ? [input.moduleId] : undefined),
          courseIds:
            input.courseIds || (input.courseId ? [input.courseId] : undefined),
          questionTypes:
            input.questionTypes ||
            (input.questionType ? [input.questionType] : undefined),
          // Keep single values for backward compatibility
          moduleId: input.moduleId,
          courseId: input.courseId,
          questionType: input.questionType as
            | 'selection'
            | 'value'
            | 'void'
            | undefined,
        }
      : undefined;

    return this.questionsService.findAll(query);
  }

  @Query(() => Question, { name: 'question', nullable: true })
  async getQuestion(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Question | null> {
    const question = await this.questionsService.findUnique(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }
}
