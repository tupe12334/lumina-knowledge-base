import { describe, expect, it, vi, beforeEach } from 'vitest';

import { ProgressTracker, withProgress } from './progress-tracker';

describe('ProgressTracker', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let mockPerformance: { now: () => number };

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockPerformance = { now: vi.fn().mockReturnValue(100) };
    // @ts-expect-error - mocking performance
    global.performance = mockPerformance;
  });

  it('should create a tracker with default config', () => {
    const tracker = new ProgressTracker('Test Operation', 100);
    expect(tracker).toBeDefined();
  });

  it('should track progress correctly', () => {
    const tracker = new ProgressTracker('Test Operation', 100);

    tracker.updateItem('created', 'item1');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should complete successfully', () => {
    const tracker = new ProgressTracker('Test Operation', 100);

    const metrics = tracker.complete();
    expect(metrics).toBeDefined();
    expect(metrics.processedItems).toBe(0);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅ Test Operation completed'),
    );
  });

  it('should handle errors', () => {
    const tracker = new ProgressTracker('Test Operation', 100);
    const error = new Error('Test error');

    tracker.updateItem('error', 'item1', error);
    const metrics = tracker.complete();
    expect(metrics.errorItems).toBe(1);
    expect(metrics.errors).toHaveLength(1);
  });

  it('should track batch updates', () => {
    const tracker = new ProgressTracker('Test Operation', 1000);

    tracker.updateBatch(100, 50, 30, 20, 0);
    const metrics = tracker.complete();

    expect(metrics.processedItems).toBe(100);
    expect(metrics.createdItems).toBe(50);
    expect(metrics.updatedItems).toBe(30);
    expect(metrics.skippedItems).toBe(20);
  });

  it('should track memory usage when enabled', () => {
    global.process = {
      ...process,
      memoryUsage: vi.fn().mockReturnValue({
        rss: 1024 * 1024,
        heapUsed: 1024 * 1024, // 1MB
        heapTotal: 2048 * 1024,
        external: 0,
        arrayBuffers: 0,
      }),
    };

    const tracker = new ProgressTracker('Test Operation', 100, {
      showMemoryUsage: true,
    });

    tracker.updateItem('created', 'item1');
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should add notes correctly', () => {
    const tracker = new ProgressTracker('Test Operation', 100);

    tracker.addNote('Test note', 'info');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('ℹ️'));
  });
});

describe('withProgress', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should wrap operation with progress tracking', async () => {
    const mockOperation = vi.fn().mockResolvedValue('success');

    const { result, metrics } = await withProgress(
      'Test Operation',
      1,
      mockOperation,
    );

    expect(result).toBe('success');
    expect(metrics).toBeDefined();
    expect(mockOperation).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('✅ Test Operation completed'),
    );
  });

  it('should handle operation errors', async () => {
    const error = new Error('Test error');
    const mockOperation = vi.fn().mockRejectedValue(error);

    await expect(
      withProgress('Test Operation', 1, mockOperation),
    ).rejects.toThrow('Test error');

    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('❌'));
  });

  it('should pass tracker to operation', async () => {
    const mockOperation = vi
      .fn()
      .mockImplementation((tracker: ProgressTracker) => {
        tracker.updateItem('created', 'item1');
        return Promise.resolve('success');
      });

    const { result } = await withProgress('Test Operation', 100, mockOperation);

    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledWith(expect.any(ProgressTracker));
  });
});
