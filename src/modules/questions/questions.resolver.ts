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
    return this.questionsService.findAll(input);
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
