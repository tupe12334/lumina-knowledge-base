import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Institution } from '../models/Institution.entity';

export const InstitutionsCrudApiDecorators = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new institution',
        description: 'Creates a new institution record.',
      }),
      ApiCreatedResponse({
        type: Institution,
        description: 'The newly created institution.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  CreateMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create multiple institutions',
        description: 'Creates multiple institution records in a single operation.',
      }),
      ApiCreatedResponse({
        description: 'The number of institutions created.',
        schema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Number of institutions created',
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
        summary: 'Retrieve all institutions',
        description: 'Returns a list of all institutions.',
      }),
      ApiOkResponse({
        type: Institution,
        isArray: true,
        description: 'A list of institutions.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve an institution by ID',
        description: 'Returns a single institution by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the institution', type: String }),
      ApiOkResponse({
        type: Institution,
        description: 'The institution with the specified ID.',
      }),
      ApiResponse({ status: 404, description: 'Institution not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update an institution by ID',
        description: 'Updates an existing institution record.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the institution', type: String }),
      ApiOkResponse({ type: Institution, description: 'The updated institution.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Institution not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete an institution by ID',
        description: 'Deletes an institution record by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the institution', type: String }),
      ApiNoContentResponse({ description: 'Institution successfully deleted.' }),
      ApiResponse({ status: 404, description: 'Institution not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};