import { NotFoundException } from '@nestjs/common';

export class ErrorHandlerHelper {
  /**
   * Handles errors for summary generation endpoints
   */
  static handleSummaryError(err: unknown): never {
    if (err instanceof NotFoundException) {
      throw new NotFoundException(err.message);
    }

    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('not found')) {
      throw new NotFoundException(message);
    }

    throw err instanceof Error ? err : new Error(String(err));
  }
}