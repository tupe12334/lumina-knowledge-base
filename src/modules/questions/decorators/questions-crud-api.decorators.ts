import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Question } from '../models/Question.entity';
import { PaginatedQuestionsResponse } from '../dto/paginated-questions-response.dto';

export const QuestionsCrudApiDecorators = {
  CreateQuestion: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new question',
        description: 'Creates a new question record.',
      }),
      ApiCreatedResponse({
        type: Question,
        description: 'The newly created question.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  CreateMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create multiple questions',
        description: 'Creates multiple question records in a single operation.',
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

  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all questions',
        description: 'Returns a list of all questions with optional filtering.',
      }),
      ApiOkResponse({
        type: Question,
        isArray: true,
        description: 'A list of questions.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve a question by ID',
        description: 'Returns a single question by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the question', type: String }),
      ApiOkResponse({
        type: Question,
        description: 'The question with the specified ID.',
      }),
      ApiResponse({ status: 404, description: 'Question not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a question by ID',
        description: 'Updates an existing question record.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the question', type: String }),
      ApiOkResponse({ type: Question, description: 'The updated question.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Question not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a question by ID',
        description: 'Deletes a question record by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the question', type: String }),
      ApiNoContentResponse({ description: 'Question successfully deleted.' }),
      ApiResponse({ status: 404, description: 'Question not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};