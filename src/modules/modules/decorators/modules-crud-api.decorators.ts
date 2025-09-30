import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Module } from '../models/Module.entity';

export const ModulesCrudApiDecorators = {
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

  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all modules',
        description: 'Returns a list of all modules with optional filtering.',
      }),
      ApiOkResponse({
        type: Module,
        isArray: true,
        description: 'A list of modules.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve a specific module',
        description: 'Returns a single module by its ID.',
      }),
      ApiParam({ name: 'id', description: 'Module ID' }),
      ApiOkResponse({
        type: Module,
        description: 'The requested module.',
      }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a module',
        description: 'Updates an existing module record.',
      }),
      ApiParam({ name: 'id', description: 'Module ID' }),
      ApiOkResponse({
        type: Module,
        description: 'The updated module.',
      }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a module',
        description: 'Deletes a module record.',
      }),
      ApiParam({ name: 'id', description: 'Module ID' }),
      ApiNoContentResponse({
        description: 'Module successfully deleted.',
      }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};