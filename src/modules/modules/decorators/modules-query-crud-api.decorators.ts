import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiNoContentResponse, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Module } from '../models/Module.entity';

export const ModulesQueryCrudApiDecorators = {
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all modules',
        description: 'Returns a list of all modules.',
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
        summary: 'Retrieve a module by ID',
        description: 'Returns a single module by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the module', type: String }),
      ApiOkResponse({
        type: Module,
        description: 'The module with the specified ID.',
      }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a module by ID',
        description: 'Updates an existing module record.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the module', type: String }),
      ApiOkResponse({ type: Module, description: 'The updated module.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a module by ID',
        description: 'Deletes a module record by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the module', type: String }),
      ApiNoContentResponse({ description: 'Module successfully deleted.' }),
      ApiResponse({ status: 404, description: 'Module not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};