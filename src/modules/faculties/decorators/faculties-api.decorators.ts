import { applyDecorators } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Faculty } from '../models/Faculty.entity';
export const FacultiesApiDecorators = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a new faculty',
        description: 'Creates a new faculty record.',
      }),
      ApiCreatedResponse({
        type: Faculty,
        description: 'The newly created faculty.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
  CreateMany: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create multiple faculties',
        description: 'Creates multiple faculty records in a single operation.',
      }),
      ApiCreatedResponse({
        description: 'The number of faculties created.',
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', description: 'Number of faculties created', example: 5 },
          },
        },
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all faculties',
        description: 'Returns a list of all faculties.',
      }),
      ApiOkResponse({
        type: Faculty,
        isArray: true,
        description: 'A list of faculties.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve a faculty by ID',
        description: 'Returns a single faculty by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the faculty', type: String }),
      ApiOkResponse({
        type: Faculty,
        description: 'The faculty with the specified ID.',
      }),
      ApiResponse({ status: 404, description: 'Faculty not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a faculty by ID',
        description: 'Updates an existing faculty record.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the faculty', type: String }),
      ApiOkResponse({ type: Faculty, description: 'The updated faculty.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Faculty not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a faculty by ID',
        description: 'Deletes a faculty record by its ID.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the faculty', type: String }),
      ApiNoContentResponse({ description: 'Faculty successfully deleted.' }),
      ApiResponse({ status: 404, description: 'Faculty not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
  FindByUniversity: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve faculties by university ID',
        description: 'Returns a list of faculties associated with a specific university ID.',
      }),
      ApiParam({ name: 'universityId', description: 'The ID of the university', type: String }),
      ApiOkResponse({
        type: Faculty,
        isArray: true,
        description: 'A list of faculties for the specified university.',
      }),
      ApiResponse({ status: 404, description: 'University not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ), };
