import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiProduces,
} from '@nestjs/swagger';

export const InstitutionsExtendedApiDecorators = {
  GetSummary: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Get institution summary',
        description:
          'Returns a human-readable plain text summary for the specified institution.',
      }),
      ApiParam({
        name: 'id',
        description: 'The ID of the institution',
        type: String,
      }),
      ApiProduces('text/plain'),
      ApiOkResponse({
        description: 'Plain text summary of the institution',
        schema: { type: 'string' },
      }),
      ApiResponse({ status: 400, description: 'Invalid ID format' }),
      ApiResponse({ status: 404, description: 'University not found' }),
      ApiResponse({ status: 500, description: 'Internal Server Error' }),
    ),
};