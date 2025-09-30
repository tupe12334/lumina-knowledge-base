import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiProduces,
  ApiParam,
} from '@nestjs/swagger';
import { PaginatedQuestionsResponse } from '../dto/paginated-questions-response.dto';

export const QuestionsOperationsApiDecorators = {
  CreateCompleteQuestions: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create complete questions with translations and answers',
        description: 'Creates multiple complete question records with translations and answers in a single operation.',
      }),
      ApiCreatedResponse({
        description: 'The number of questions created.',
        schema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Number of questions created',
              example: 5,
            },
          },
        },
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  FindAllPaginated: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve paginated questions',
        description: 'Returns a paginated list of questions with optional filtering.',
      }),
      ApiOkResponse({
        type: PaginatedQuestionsResponse,
        description: 'A paginated list of questions.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  GetSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get question summary',
        description: 'Returns a human-readable plain text summary for the specified question.',
      }),
      ApiParam({
        name: 'id',
        description: 'The ID of the question',
        type: String,
      }),
      ApiProduces('text/plain'),
      ApiOkResponse({
        description: 'Plain text summary of the question',
        schema: { type: 'string' },
      }),
      ApiResponse({ status: 400, description: 'Invalid ID format' }),
      ApiResponse({ status: 404, description: 'Question not found' }),
      ApiResponse({ status: 500, description: 'Internal Server Error' }),
    ),
};