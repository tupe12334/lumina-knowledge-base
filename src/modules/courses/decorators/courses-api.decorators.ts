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
import { Course } from '../models/Course.entity';
import { CourseRelationshipResult } from '../dto/course-relationship-result.type';

export const CreateCourseApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new course',
      description: 'Creates a new course record.',
    }),
    ApiCreatedResponse({
      type: Course,
      description: 'The newly created course.',
    }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const CreateManyCoursesApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create multiple courses',
      description: 'Creates multiple course records in a single operation.',
    }),
    ApiCreatedResponse({
      description: 'The number of courses created.',
      schema: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Number of courses created',
            example: 10,
          },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const FindAllCoursesApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve all courses',
      description: 'Returns a list of all courses.',
    }),
    ApiOkResponse({
      type: Course,
      isArray: true,
      description: 'A list of courses.',
    }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const FindOneCourseApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Retrieve a course by ID',
      description: 'Returns a single course by its ID.',
    }),
    ApiParam({ name: 'id', description: 'The ID of the course', type: String }),
    ApiOkResponse({
      type: Course,
      description: 'The course with the specified ID.',
    }),
    ApiResponse({ status: 404, description: 'Course not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const UpdateCourseApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update a course by ID',
      description: 'Updates an existing course record.',
    }),
    ApiParam({ name: 'id', description: 'The ID of the course', type: String }),
    ApiOkResponse({ type: Course, description: 'The updated course.' }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
    ApiResponse({ status: 404, description: 'Course not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const DeleteCourseApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete a course by ID',
      description: 'Deletes a course record by its ID.',
    }),
    ApiParam({ name: 'id', description: 'The ID of the course', type: String }),
    ApiNoContentResponse({ description: 'Course successfully deleted.' }),
    ApiResponse({ status: 404, description: 'Course not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const CreateRelationshipApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a course relationship',
      description: 'Creates a prerequisite relationship between courses.',
    }),
    ApiCreatedResponse({
      type: CourseRelationshipResult,
      description: 'The created course relationship.',
    }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
    ApiResponse({ status: 404, description: 'Course not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const DeleteRelationshipApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete a course relationship',
      description: 'Deletes a prerequisite relationship between courses.',
    }),
    ApiOkResponse({
      description: 'The deleted course relationship result.',
    }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
    ApiResponse({ status: 404, description: 'Relationship not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const SetModulesApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Set modules for a course',
      description: 'Sets the modules associated with a course.',
    }),
    ApiParam({ name: 'id', description: 'The ID of the course', type: String }),
    ApiOkResponse({
      type: Course,
      description: 'The course with updated modules.',
    }),
    ApiResponse({ status: 400, description: 'Bad Request.' }),
    ApiResponse({ status: 404, description: 'Course not found.' }),
    ApiResponse({ status: 500, description: 'Internal Server Error.' }),
  );

export const GetSummaryApi = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get course summary',
      description:
        'Returns a human-readable plain text summary for the specified course.',
    }),
    ApiParam({
      name: 'id',
      description: 'The ID of the course',
      type: String,
    }),
    ApiProduces('text/plain'),
    ApiOkResponse({
      description: 'Plain text summary of the course',
      schema: { type: 'string' },
    }),
    ApiResponse({ status: 400, description: 'Invalid ID format' }),
    ApiResponse({ status: 404, description: 'Course not found' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );