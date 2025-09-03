import { Resolver, Query, Args } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/question-query.dto';

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


}
