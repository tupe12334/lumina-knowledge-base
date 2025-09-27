import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Course } from '../models/Course.entity';

export const CoursesOperationsApiDecorators = {
  FindAll: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve all courses',
        description: 'Returns a list of all courses with optional filtering.',
      }),
      ApiOkResponse({
        type: Course,
        isArray: true,
        description: 'A list of courses.',
      }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  FindOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Retrieve a specific course',
        description: 'Returns a single course by its ID.',
      }),
      ApiParam({ name: 'id', description: 'Course ID' }),
      ApiOkResponse({
        type: Course,
        description: 'The requested course.',
      }),
      ApiResponse({ status: 404, description: 'Course not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Update a course',
        description: 'Updates an existing course record.',
      }),
      ApiParam({ name: 'id', description: 'Course ID' }),
      ApiOkResponse({
        type: Course,
        description: 'The updated course.',
      }),
      ApiResponse({ status: 404, description: 'Course not found.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  Delete: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a course',
        description: 'Deletes a course and optionally its related data.',
      }),
      ApiParam({ name: 'id', description: 'Course ID' }),
      ApiNoContentResponse({
        description: 'Course successfully deleted.',
      }),
      ApiResponse({ status: 404, description: 'Course not found.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};