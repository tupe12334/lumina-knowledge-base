import { BadRequestException } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

type OptionalDocument = OpenAPIObject | undefined;
type OptionalFilePath = string | undefined;

/**
 * Write the OpenAPI specification to a file.
 *
 * @param document - Generated Swagger document.
 * @param filePath - Path to the output file.
 */
export const saveOpenapiSpec = async (
  document: OptionalDocument,
  filePath: OptionalFilePath,
): Promise<void> => {
  if (!document || !filePath) {
    return;
  }

  // Validate file path to prevent directory traversal and ensure safe file operations
  if (filePath.includes('..') || !filePath.endsWith('.json') || filePath.includes('/etc/') || filePath.includes('/var/')) {
    throw new BadRequestException('Invalid file path provided');
  }

  // Additional validation for allowed characters
  const allowedPathPattern = /^[a-zA-Z0-9\-_/.]+\.json$/;
  if (!allowedPathPattern.test(filePath)) {
    throw new BadRequestException('File path contains invalid characters');
  }

  const targetPath = resolve(filePath);
  await writeFile(targetPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
};
