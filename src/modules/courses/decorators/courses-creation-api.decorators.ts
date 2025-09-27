import { applyDecorators } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Course } from '../models/Course.entity';

export const CoursesCreationApiDecorators = {
  CreateCourse: () =>
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
    ),

  CreateMany: () =>
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
    ),
};