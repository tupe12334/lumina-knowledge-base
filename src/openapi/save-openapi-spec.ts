import { BadRequestException } from '@nestjs/common';
import { OpenAPIObject } from '@nestjs/swagger';
import { writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';

type OptionalDocument = OpenAPIObject | undefined;
type OptionalFilePath = string | undefined;

const DOCS_DIR = 'docs' as const;
const DEFAULT_FILENAME = 'openapi.json' as const;

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

  const baseName = filePath.split('/').pop() || DEFAULT_FILENAME;
  const sanitizedFileName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const allowedFileName = sanitizedFileName.endsWith('.json') ? sanitizedFileName : DEFAULT_FILENAME;

  await mkdir('docs', { recursive: true });

  const baseDocsPath = resolve(process.cwd(), DOCS_DIR);
  const targetPath = resolve(baseDocsPath, allowedFileName);

  if (!targetPath.startsWith(baseDocsPath)) {
    throw new BadRequestException('Invalid target path');
  }

  const fileContent = JSON.stringify(document, null, 2);

  if (allowedFileName === DEFAULT_FILENAME) {
    await writeFile('docs/openapi.json', fileContent, { encoding: 'utf8' });
  } else {
    const fs = await import('fs/promises');
    await fs.writeFile(targetPath, fileContent, { encoding: 'utf8' });
  }
};
