import { describe, expect, it, vi, beforeEach } from 'vitest';

import { ErrorRecovery, withErrorRecovery } from './error-recovery';

describe('ErrorRecovery', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create error recovery with default config', () => {
    const recovery = new ErrorRecovery();
    expect(recovery).toBeDefined();
  });

  it('should execute operation successfully on first try', async () => {
    const recovery = new ErrorRecovery();
    const mockOperation = vi.fn().mockResolvedValue('success');

    const result = await recovery.executeWithRecovery(
      mockOperation,
      'Test Operation',
    );

    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should retry on retryable failures', async () => {
    const recovery = new ErrorRecovery({ maxRetries: 2, baseDelay: 10 });
    const mockOperation = vi
      .fn()
      .mockRejectedValueOnce(new Error('ECONNRESET'))
      .mockRejectedValueOnce(new Error('timeout occurred'))
      .mockResolvedValue('success');

    const result = await recovery.executeWithRecovery(
      mockOperation,
      'Test Operation',
    );

    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(3);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
  });

  it('should skip on error when configured', async () => {
    const recovery = new ErrorRecovery({ maxRetries: 0 });
    const error = new Error('Non-retryable failure');
    const mockOperation = vi.fn().mockRejectedValue(error);

    const result = await recovery.executeWithRecovery(
      mockOperation,
      'Test Operation',
      'item-1',
      { skipOnError: true },
    );

    expect(result).toBeNull();
    expect(mockOperation).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('⏭️  Skipping Test Operation for item-1'),
    );
  });

  it('should continue on error with fallback value', async () => {
    const recovery = new ErrorRecovery({ maxRetries: 0 });
    const error = new Error('Non-retryable failure');
    const mockOperation = vi.fn().mockRejectedValue(error);

    const result = await recovery.executeWithRecovery(
      mockOperation,
      'Test Operation',
      undefined,
      { continueOnError: true, fallbackValue: 'fallback' },
    );

    expect(result).toBe('fallback');
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should execute batch operations with error isolation', async () => {
    const recovery = new ErrorRecovery({ maxRetries: 0 });
    const operations = [
      {
        operation: vi.fn().mockResolvedValue('success1'),
        name: 'op1',
        id: 'id1',
      },
      {
        operation: vi.fn().mockRejectedValue(new Error('failure')),
        name: 'op2',
        id: 'id2',
      },
      {
        operation: vi.fn().mockResolvedValue('success3'),
        name: 'op3',
        id: 'id3',
      },
    ];

    const results = await recovery.executeBatch(operations, {
      continueOnError: true,
    });

    expect(results).toEqual(['success1', null, 'success3']);
    expect(operations[0].operation).toHaveBeenCalledTimes(1);
    expect(operations[1].operation).toHaveBeenCalledTimes(1);
    expect(operations[2].operation).toHaveBeenCalledTimes(1);
  });

  it('should provide error summary', async () => {
    const recovery = new ErrorRecovery({ maxRetries: 0 });
    const error = new Error('Test error');
    const mockOperation = vi.fn().mockRejectedValue(error);

    await recovery.executeWithRecovery(
      mockOperation,
      'Test Operation',
      'item-1',
      { skipOnError: true },
    );

    const summary = recovery.getErrorSummary();
    expect(summary.totalErrors).toBe(1);
    expect(summary.errorsByOperation['Test Operation']).toBe(1);
    expect(summary.recentErrors).toHaveLength(1);
    expect(summary.recentErrors[0].message).toBe('Test error');
  });
});

describe('withErrorRecovery', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should wrap operation with error recovery', async () => {
    const mockOperation = vi.fn().mockResolvedValue('success');

    const result = await withErrorRecovery(
      mockOperation,
      'Test Operation',
      'item-1',
    );

    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalled();
  });

  it('should handle operation with recovery options', async () => {
    const mockOperation = vi.fn().mockRejectedValue(new Error('Failure'));

    const result = await withErrorRecovery(
      mockOperation,
      'Test Operation',
      'item-1',
      { skipOnError: true },
    );

    expect(result).toBeNull();
    expect(mockOperation).toHaveBeenCalledTimes(1);
  });

  it('should propagate final failure when not configured to continue', async () => {
    const error = new Error('Final failure');
    const mockOperation = vi.fn().mockRejectedValue(error);

    await expect(
      withErrorRecovery(mockOperation, 'Test Operation', 'item-1', {
        continueOnError: false,
      }),
    ).rejects.toThrow('Failed to execute Test Operation for item-1');
  });
});
