import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Degree } from '../models/Degree.entity';

export const DegreesRelationshipApiDecorators = {
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
};