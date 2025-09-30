import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';

export const DegreesSummaryApiDecorators = {
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