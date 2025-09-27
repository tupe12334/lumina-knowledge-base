import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';
import { Degree } from '../models/Degree.entity';

export const DegreesApiDecorators = {
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

  SetFaculty: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Set faculty for a degree',
        description: 'Sets or updates the faculty associated with a degree.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the degree', type: String }),
      ApiOkResponse({
        type: Degree,
        description: 'The degree with the updated faculty.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Degree or Faculty not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  AddCourse: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Add a course to a degree',
        description: 'Adds a course to the specified degree.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the degree', type: String }),
      ApiOkResponse({
        type: Degree,
        description: 'The degree with the added course.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Degree or Course not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  GetCourses: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get courses for a degree',
        description: 'Returns all courses associated with the specified degree.',
      }),
      ApiParam({
        name: 'id',
        description: 'The ID of the degree',
        type: String,
      }),
      ApiOkResponse({
        description: 'List of courses for the degree',
        isArray: true,
      }),
      ApiResponse({ status: 400, description: 'Invalid ID format' }),
      ApiResponse({ status: 404, description: 'Degree not found' }),
      ApiResponse({ status: 500, description: 'Internal Server Error' }),
    ),

  RemoveCourse: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remove a course from a degree',
        description: 'Removes a course from the specified degree.',
      }),
      ApiParam({ name: 'id', description: 'The ID of the degree', type: String }),
      ApiParam({
        name: 'courseId',
        description: 'The ID of the course to remove',
        type: String,
      }),
      ApiOkResponse({
        type: Degree,
        description: 'The degree with the course removed.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({
        status: 404,
        description: 'Degree or Course not found, or Course not associated with Degree.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  GetSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get degree summary',
        description:
          'Returns a human-readable plain text summary for the specified degree.',
      }),
      ApiParam({
        name: 'id',
        description: 'The ID of the degree',
        type: String,
      }),
      ApiProduces('text/plain'),
      ApiOkResponse({
        description: 'Plain text summary of the degree',
        schema: { type: 'string' },
      }),
      ApiResponse({ status: 400, description: 'Invalid ID format' }),
      ApiResponse({ status: 404, description: 'Degree not found' }),
      ApiResponse({ status: 500, description: 'Internal Server Error' }),
    ),
};