import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Module } from '../models/Module.entity';

export const ModulesBasicCrudApiDecorators = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new module',
        description: 'Creates a new module record.',
      }),
      ApiCreatedResponse({
        type: Module,
        description: 'The newly created module.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  CreateMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create multiple modules',
        description: 'Creates multiple module records in a single operation.',
      }),
      ApiCreatedResponse({
        description: 'The number of modules created.',
        schema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Number of modules created',
              example: 5,
            },
          },
        },
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};