/**
 * Graceful error handling and recovery mechanisms for seeding operations
 */

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  exponentialBackoff: boolean;
  retryableErrors: Array<string | RegExp>;
}

export interface RecoveryOptions {
  skipOnError: boolean;
  continueOnError: boolean;
  fallbackValue?: any;
  logErrors: boolean;
  saveErrorsToFile?: string;
}

export class SeedError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly itemId?: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'SeedError';
  }
}

export class ErrorRecovery {
  private errors: Array<{
    error: Error;
    operation: string;
    itemId?: string;
    timestamp: Date;
    retryCount: number;
  }> = [];

  private retryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    exponentialBackoff: true,
    retryableErrors: [
      /connection.*reset/i,
      /timeout/i,
      /temporary/i,
      /ECONNRESET/i,
      /ETIMEDOUT/i,
    ],
  };

  constructor(retryConfig?: Partial<RetryConfig>) {
    if (retryConfig) {
      this.retryConfig = { ...this.retryConfig, ...retryConfig };
    }
  }

  /**
   * Execute an operation with retry logic and error recovery
   */
  async executeWithRecovery<T>(
    operation: () => Promise<T>,
    operationName: string,
    itemId?: string,
    recoveryOptions: Partial<RecoveryOptions> = {},
  ): Promise<T | null> {
    const options: RecoveryOptions = {
      skipOnError: false,
      continueOnError: true,
      logErrors: true,
      ...recoveryOptions,
    };

    let lastError: Error | null = null;
    let retryCount = 0;

    while (retryCount <= this.retryConfig.maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        retryCount++;

        this.logError(lastError, operationName, retryCount, itemId);

        // Check if error is retryable
        if (
          retryCount <= this.retryConfig.maxRetries &&
          this.isRetryable(lastError)
        ) {
          const delay = this.calculateDelay(retryCount);
          console.log(
            `  🔄 Retrying in ${delay}ms... (${retryCount}/${this.retryConfig.maxRetries})`,
          );
          await this.sleep(delay);
          continue;
        }

        // Record the error
        this.errors.push({
          error: lastError,
          operation: operationName,
          itemId,
          timestamp: new Date(),
          retryCount: retryCount - 1,
        });

        // Handle error based on recovery options
        if (options.skipOnError) {
          console.log(
            `  ⏭️  Skipping ${operationName}${itemId ? ` for ${itemId}` : ''} due to error`,
          );
          return null;
        }

        if (options.continueOnError) {
          console.log(
            `  🔀 Continuing despite error in ${operationName}${itemId ? ` for ${itemId}` : ''}`,
          );
          return options.fallbackValue ?? null;
        }

        // Re-throw error if no recovery strategy
        throw new SeedError(
          `Failed to execute ${operationName}${itemId ? ` for ${itemId}` : ''}: ${lastError.message}`,
          operationName,
          itemId,
          lastError,
        );
      }
    }

    // This should never be reached, but TypeScript needs it
    throw lastError!;
  }

  /**
   * Execute multiple operations with error isolation
   */
  async executeBatch<T>(
    operations: Array<{
      operation: () => Promise<T>;
      name: string;
      id?: string;
    }>,
    recoveryOptions: Partial<RecoveryOptions> = {},
  ): Promise<Array<T | null>> {
    const results: Array<T | null> = [];

    for (let i = 0; i < operations.length; i++) {
      const { operation, name, id } = operations[i];
      try {
        const result = await this.executeWithRecovery(
          operation,
          name,
          id,
          recoveryOptions,
        );
        results.push(result);
      } catch (error) {
        console.error(
          `❌ Batch operation ${i + 1}/${operations.length} failed: ${error}`,
        );
        if (!recoveryOptions.continueOnError) {
          throw error;
        }
        results.push(null);
      }
    }

    return results;
  }

  /**
   * Check if an error is retryable based on configuration
   */
  private isRetryable(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    const errorString = error.toString().toLowerCase();

    return this.retryConfig.retryableErrors.some((pattern) => {
      if (typeof pattern === 'string') {
        return (
          errorMessage.includes(pattern.toLowerCase()) ||
          errorString.includes(pattern.toLowerCase())
        );
      }
      return pattern.test(errorMessage) || pattern.test(errorString);
    });
  }

  /**
   * Calculate delay for retry with exponential backoff
   */
  private calculateDelay(retryCount: number): number {
    if (!this.retryConfig.exponentialBackoff) {
      return this.retryConfig.baseDelay;
    }

    const delay = this.retryConfig.baseDelay * Math.pow(2, retryCount - 1);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Log error with contextual information
   */
  private logError(
    error: Error,
    operation: string,
    retryCount: number,
    itemId?: string,
  ): void {
    const context = itemId ? ` for ${itemId}` : '';
    const retryInfo = retryCount > 1 ? ` (retry ${retryCount - 1})` : '';

    console.error(
      `  ❌ Error in ${operation}${context}${retryInfo}: ${error.message}`,
    );

    // Log stack trace in verbose mode
    if (process.env.SEED_VERBOSE === 'true') {
      console.error(`     Stack: ${error.stack}`);
    }
  }

  /**
   * Get summary of all errors encountered
   */
  getErrorSummary(): {
    totalErrors: number;
    errorsByOperation: Record<string, number>;
    recentErrors: Array<{
      operation: string;
      message: string;
      timestamp: Date;
    }>;
  } {
    const errorsByOperation: Record<string, number> = {};

    this.errors.forEach((error) => {
      errorsByOperation[error.operation] =
        (errorsByOperation[error.operation] || 0) + 1;
    });

    const recentErrors = this.errors
      .slice(-10) // Last 10 errors
      .map((error) => ({
        operation: error.operation,
        message: error.error.message,
        timestamp: error.timestamp,
      }));

    return {
      totalErrors: this.errors.length,
      errorsByOperation,
      recentErrors,
    };
  }

  /**
   * Save error log to file for analysis
   */
  async saveErrorLog(filePath: string): Promise<void> {
    const fs = await import('fs/promises');
    const errorLog = {
      timestamp: new Date().toISOString(),
      summary: this.getErrorSummary(),
      details: this.errors.map((error) => ({
        operation: error.operation,
        itemId: error.itemId,
        message: error.error.message,
        stack: error.error.stack,
        timestamp: error.timestamp.toISOString(),
        retryCount: error.retryCount,
      })),
    };

    await fs.writeFile(filePath, JSON.stringify(errorLog, null, 2));
    console.log(`📄 Error log saved to ${filePath}`);
  }

  /**
   * Reset error tracking
   */
  reset(): void {
    this.errors = [];
  }
}

/**
 * Global error recovery instance with sensible defaults for seeding
 */
export const seedErrorRecovery = new ErrorRecovery({
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 5000,
  exponentialBackoff: true,
  retryableErrors: [
    /connection.*reset/i,
    /timeout/i,
    /temporary/i,
    /ECONNRESET/i,
    /ETIMEDOUT/i,
    /database.*lock/i,
    /constraint.*violation/i,
  ],
});

/**
 * Wrapper for Prisma operations with error recovery
 */
export async function withErrorRecovery<T>(
  operation: () => Promise<T>,
  operationName: string,
  itemId?: string,
  options?: Partial<RecoveryOptions>,
): Promise<T | null> {
  return seedErrorRecovery.executeWithRecovery(
    operation,
    operationName,
    itemId,
    options,
  );
}
