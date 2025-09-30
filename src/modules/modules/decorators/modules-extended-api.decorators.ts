import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { ModuleRelationshipResult } from '../dto/module-relationship-result.dto';

export const ModulesExtendedApiDecorators = {
  GetQuestionsData: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get modules questions data',
        description:
          'Returns all modules with id, en_name, and questions_amount, sorted by question count (least questions first).',
      }),
      ApiOkResponse({
        description: 'A list of modules with their question counts.',
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              en_name: { type: 'string' },
              questions_amount: { type: 'number' },
            },
          },
        },
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  CreateRelationship: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a module relationship',
        description: 'Creates a prerequisite/postrequisite relationship between two modules.',
      }),
      ApiCreatedResponse({
        type: ModuleRelationshipResult,
        description: 'The created relationship.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  DeleteRelationship: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a module relationship',
        description: 'Removes a prerequisite/postrequisite relationship between two modules.',
      }),
      ApiOkResponse({
        type: ModuleRelationshipResult,
        description: 'The deleted relationship.',
      }),
      ApiResponse({ status: 404, description: 'Relationship not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  GetSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get module summary',
        description: 'Generates a comprehensive summary of the module.',
      }),
      ApiParam({ name: 'id', description: 'Module ID' }),
      ApiProduces('text/plain'),
      ApiOkResponse({
        description: 'Module summary generated successfully.',
        schema: {
          type: 'string',
          example: 'Module: Introduction to Programming...',
        },
      }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};