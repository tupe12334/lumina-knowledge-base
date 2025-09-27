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
import { CourseRelationshipResult } from '../dto/course-relationship-result.type';

export const CoursesExtendedApiDecorators = {
  CreateRelationship: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Create a course relationship',
        description: 'Creates a prerequisite/postrequisite relationship between two courses.',
      }),
      ApiCreatedResponse({
        type: CourseRelationshipResult,
        description: 'The created relationship.',
      }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 404, description: 'Course not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  DeleteRelationship: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Delete a course relationship',
        description: 'Removes a prerequisite/postrequisite relationship between two courses.',
      }),
      ApiOkResponse({
        type: CourseRelationshipResult,
        description: 'The deleted relationship.',
      }),
      ApiResponse({ status: 404, description: 'Relationship not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  SetModules: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Set course modules',
        description: 'Sets the modules for a specific course.',
      }),
      ApiParam({ name: 'id', description: 'Course ID' }),
      ApiOkResponse({
        description: 'Modules successfully set for the course.',
        schema: {
          type: 'object',
          properties: {
            courseId: { type: 'string' },
            moduleIds: { type: 'array', items: { type: 'string' } },
          },
        },
      }),
      ApiResponse({ status: 404, description: 'Course not found.' }),
      ApiResponse({ status: 400, description: 'Bad Request.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),

  GetSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get course summary',
        description: 'Generates a comprehensive summary of the course.',
      }),
      ApiParam({ name: 'id', description: 'Course ID' }),
      ApiProduces('text/plain'),
      ApiOkResponse({
        description: 'Course summary generated successfully.',
        schema: {
          type: 'string',
          example: 'Course: Introduction to Programming...',
        },
      }),
      ApiResponse({ status: 404, description: 'Course not found.' }),
      ApiResponse({ status: 500, description: 'Internal Server Error.' }),
    ),
};