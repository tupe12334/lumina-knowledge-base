import { BadRequestException } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { writeFile, mkdir } from 'fs/promises';
import { resolve, dirname } from 'path';

type OptionalDocument = OpenAPIObject | undefined;
type OptionalFilePath = string | undefined;

export const saveOpenapiSpec = async (
  document: OptionalDocument,
  filePath: OptionalFilePath,
): Promise<void> => {
  if (!document || !filePath) {
    return;
  }

  if (filePath.includes('..') || !filePath.endsWith('.json') || filePath.includes('/etc/') || filePath.includes('/var/')) {
    throw new BadRequestException('Invalid file path provided');
  }

  const allowedPathPattern = /^[a-zA-Z0-9\-_/.]+\.json$/;
  if (!allowedPathPattern.test(filePath)) {
    throw new BadRequestException('File path contains invalid characters');
  }

  const baseName = filePath.split('/').pop() || 'openapi.json';
  const sanitizedFileName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const allowedFileName = sanitizedFileName.endsWith('.json') ? sanitizedFileName : 'openapi.json';

  const baseDocsPath = 'docs';
  const docsPath = resolve(process.cwd(), baseDocsPath);

  await mkdir(docsPath, { recursive: true });

  const safeTargetPath = resolve(docsPath, allowedFileName);
  if (!safeTargetPath.startsWith(docsPath)) {
    throw new BadRequestException('Invalid target path');
  }

  await writeFile(safeTargetPath, JSON.stringify(document, null, 2), {
    encoding: 'utf8',
  });
};
