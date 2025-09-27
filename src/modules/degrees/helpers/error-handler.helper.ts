import { NotFoundException } from '@nestjs/common';

export class ErrorHandlerHelper {
  static handleSummaryError(err: unknown): never {
    if (err instanceof NotFoundException && err instanceof Error) {
      throw new NotFoundException(err.message);
    }
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('not found')) {
      throw new NotFoundException(message);
    }
    throw err instanceof Error ? err : new Error(String(err));
  }

  static normalizeFacultyId(facultyId: string | null | undefined): string | null {
    return facultyId !== null && facultyId !== undefined ? facultyId : null;
  }
}