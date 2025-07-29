import { OpenAPIObject } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * Write the OpenAPI specification to a file.
 *
 * @param document - Generated Swagger document.
 * @param filePath - Path to the output file.
 */
export const saveOpenapiSpec = async (
  document: OpenAPIObject | undefined,
  filePath: string | undefined,
): Promise<void> => {
  if (!document || !filePath) {
    return;
  }

  const targetPath = resolve(filePath);
  await writeFile(targetPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
};
