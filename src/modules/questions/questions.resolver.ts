import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { PaginatedQuestionsResponse } from './dto/paginated-questions-response.dto';

/**
 * GraphQL resolver for question-related operations.
 * Provides GraphQL queries for retrieving question information.
 */
@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * Retrieves all questions with optional filtering.
   * @param input - Optional filtering parameters
   * @returns Promise<Question[]> Array of questions matching the criteria
   */
  @Query(() => [Question], {
    name: 'questions',
    description: 'Get all questions with optional filtering',
  })
  async getQuestions(
    @Args('input', { type: () => QuestionsQueryDto, nullable: true })
    input?: QuestionsQueryDto,
  ): Promise<Question[]> {
    return this.questionsService.findAll(input);
  }

  /**
   * Retrieves questions with pagination support for infinite scroll.
   * @param input - Optional filtering and pagination parameters
   * @returns Promise<PaginatedQuestionsResponse> Paginated questions with metadata
   */
  @Query(() => PaginatedQuestionsResponse, {
    name: 'questionsPaginated',
    description: 'Get questions with pagination support for infinite scroll',
  })
  async getQuestionsPaginated(
    @Args('input', { type: () => QuestionsQueryDto, nullable: true })
    input?: QuestionsQueryDto,
  ): Promise<PaginatedQuestionsResponse> {
    return this.questionsService.findAllPaginated(input);
  }

  /**
   * Retrieves a specific question by its ID.
   * @param id - The unique identifier of the question
   * @returns Promise<Question> The question if found
   * @throws NotFoundException if question is not found
   */
  @Query(() => Question, {
    name: 'question',
    nullable: true,
    description: 'Get a specific question by ID',
  })
  async getQuestion(
    @Args('id', { type: () => ID, description: 'Question ID' }) id: string,
  ): Promise<Question | null> {
    const question = await this.questionsService.findUnique(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

}
