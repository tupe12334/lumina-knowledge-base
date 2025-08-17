import { Resolver, Query, Args, ID, Mutation } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from './models/Question.entity';
import { QuestionsQueryDto } from './dto/question-query.dto';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { DeleteQuestionInput } from './dto/delete-question.input';

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

  @Mutation(() => Question, {
    name: 'createQuestion',
    description: 'Create a new question',
  })
  async createQuestion(
    @Args('input') input: CreateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.create(input);
  }

  @Mutation(() => Question, {
    name: 'updateQuestion',
    description: 'Update an existing question',
  })
  async updateQuestion(
    @Args('input') input: UpdateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.update(input);
  }

  @Mutation(() => Question, {
    name: 'deleteQuestion',
    description: 'Delete a question',
  })
  async deleteQuestion(
    @Args('input') input: DeleteQuestionInput,
  ): Promise<Question> {
    return this.questionsService.remove(input);
  }
}
