import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Degree } from '../models/Degree.entity';

export const DegreesCrudApiDecorators = {
  CreateDegree: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new degree',
        description: 'Creates a new degree record.',
      }),
      ApiCreatedResponse({
        type: Degree,
        description: 'The newly created degree.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  CreateMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create multiple degrees',
        description: 'Creates multiple degree records in a single operation.',
      }),
      ApiCreatedResponse({
        description: 'The number of degrees created.',
        schema: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'Number of degrees created',
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
        summary: 'Retrieve all degrees',
        description: 'Returns a list of all degrees.',
      }),
      ApiOkResponse({
        type: Degree,
        isArray: true,
        description: 'A list of degrees.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve a degree by ID',
        description: 'Returns a single degree by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the degree', type: String }),
      ApiOkResponse({
        type: Degree,
        description: 'The degree with the specified ID.',
      }),
      ApiResponse({ status: 404, description: 'Degree not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a degree by ID',
        description: 'Updates an existing degree record.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the degree', type: String }),
      ApiOkResponse({ type: Degree, description: 'The updated degree.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Degree not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a degree by ID',
        description: 'Deletes a degree record by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the degree', type: String }),
      ApiNoContentResponse({ description: 'Degree successfully deleted.' }),
      ApiResponse({ status: 404, description: 'Degree not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};