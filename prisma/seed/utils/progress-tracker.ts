/**
 * Progress tracking and monitoring utilities for database seeding operations
 *
 * Features:
 * - Real-time progress visualization
 * - Performance metrics tracking
 * - Memory usage monitoring
 * - Graceful error handling and recovery
 * - Detailed completion summaries
 */

export interface ProgressConfig {
  showMemoryUsage?: boolean;
  showDuration?: boolean;
  showPercentage?: boolean;
  logLevel?: 'minimal' | 'normal' | 'verbose';
  updateInterval?: number; // milliseconds
}

export interface SeedMetrics {
  totalItems: number;
  processedItems: number;
  createdItems: number;
  updatedItems: number;
  skippedItems: number;
  errorItems: number;
  startTime: number;
  endTime?: number;
  memoryStart?: NodeJS.MemoryUsage;
  memoryPeak?: NodeJS.MemoryUsage;
  batchSizes: number[];
  errors: Array<{ item: string; error: Error; timestamp: number }>;
}

export class ProgressTracker {
  private config: Required<ProgressConfig>;
  private metrics: SeedMetrics;
  private lastUpdate: number = 0;
  private progressBar: string = '';

  constructor(
    private taskName: string,
    private totalItems: number,
    config: ProgressConfig = {},
  ) {
    this.config = {
      showMemoryUsage: true,
      showDuration: true,
      showPercentage: true,
      logLevel: 'normal',
      updateInterval: 100,
      ...config,
    };

    this.metrics = {
      totalItems,
      processedItems: 0,
      createdItems: 0,
      updatedItems: 0,
      skippedItems: 0,
      errorItems: 0,
      startTime: performance.now(),
      batchSizes: [],
      errors: [],
    };

    if (this.config.showMemoryUsage) {
      this.metrics.memoryStart = process.memoryUsage();
      this.metrics.memoryPeak = { ...this.metrics.memoryStart };
    }

    this.logStart();
  }

  /**
   * Update progress for a single item
   */
  updateItem(
    status: 'created' | 'updated' | 'skipped' | 'error',
    itemName?: string,
    error?: Error,
  ): void {
    this.metrics.processedItems++;

    switch (status) {
      case 'created':
        this.metrics.createdItems++;
        break;
      case 'updated':
        this.metrics.updatedItems++;
        break;
      case 'skipped':
        this.metrics.skippedItems++;
        break;
      case 'error':
        this.metrics.errorItems++;
        if (error && itemName) {
          this.metrics.errors.push({
            item: itemName,
            error,
            timestamp: performance.now(),
          });
        }
        break;
    }

    // Update memory peak tracking
    if (this.config.showMemoryUsage) {
      const currentMemory = process.memoryUsage();
      if (currentMemory.heapUsed > this.metrics.memoryPeak!.heapUsed) {
        this.metrics.memoryPeak = currentMemory;
      }
    }

    this.updateDisplay();
  }

  /**
   * Update progress for a batch of items
   */
  updateBatch(
    batchSize: number,
    created: number = 0,
    updated: number = 0,
    skipped: number = 0,
    errors: number = 0,
  ): void {
    this.metrics.processedItems += batchSize;
    this.metrics.createdItems += created;
    this.metrics.updatedItems += updated;
    this.metrics.skippedItems += skipped;
    this.metrics.errorItems += errors;
    this.metrics.batchSizes.push(batchSize);

    this.updateDisplay();
  }

  /**
   * Add a performance note or milestone
   */
  addNote(
    note: string,
    level: 'info' | 'success' | 'warning' | 'error' = 'info',
  ): void {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const timestamp = this.formatDuration(
      performance.now() - this.metrics.startTime,
    );

    if (this.config.logLevel !== 'minimal') {
      console.log(`  ${icons[level]} [${timestamp}] ${note}`);
    }
  }

  /**
   * Complete the progress tracking and show summary
   */
  complete(): SeedMetrics {
    this.metrics.endTime = performance.now();
    this.logCompletion();
    return { ...this.metrics };
  }

  /**
   * Get current progress as percentage
   */
  getProgressPercentage(): number {
    return Math.round(
      (this.metrics.processedItems / this.metrics.totalItems) * 100,
    );
  }

  /**
   * Get estimated time remaining
   */
  getEstimatedTimeRemaining(): number {
    if (this.metrics.processedItems === 0) return 0;

    const elapsed = performance.now() - this.metrics.startTime;
    const rate = this.metrics.processedItems / elapsed;
    const remaining = this.metrics.totalItems - this.metrics.processedItems;

    return remaining / rate;
  }

  private updateDisplay(): void {
    const now = performance.now();
    if (now - this.lastUpdate < this.config.updateInterval) return;
    this.lastUpdate = now;

    if (this.config.logLevel === 'minimal') return;

    const percentage = this.getProgressPercentage();
    const progressBar = this.generateProgressBar(percentage);
    const duration = this.formatDuration(now - this.metrics.startTime);
    const eta = this.formatDuration(this.getEstimatedTimeRemaining());
    const memory = this.config.showMemoryUsage
      ? this.formatMemory(process.memoryUsage().heapUsed)
      : '';

    let statusLine = `  📊 ${progressBar} ${percentage}%`;

    if (this.config.showDuration) {
      statusLine += ` | ${duration}`;
      if (percentage < 100 && percentage > 5) {
        statusLine += ` | ETA: ${eta}`;
      }
    }

    if (this.config.showMemoryUsage) {
      statusLine += ` | Memory: ${memory}`;
    }

    // Only show detailed breakdown in verbose mode
    if (this.config.logLevel === 'verbose') {
      statusLine += ` | C:${this.metrics.createdItems} U:${this.metrics.updatedItems} S:${this.metrics.skippedItems}`;
      if (this.metrics.errorItems > 0) {
        statusLine += ` E:${this.metrics.errorItems}`;
      }
    }

    // Clear previous line and write new progress
    process.stdout.write('\r' + statusLine);

    if (percentage === 100) {
      process.stdout.write('\n');
    }
  }

  private generateProgressBar(percentage: number, width: number = 20): string {
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  private formatDuration(ms: number): string {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}m ${seconds}s`;
  }

  private formatMemory(bytes: number): string {
    const mb = bytes / 1024 / 1024;
    if (mb < 1024) return `${mb.toFixed(1)}MB`;
    return `${(mb / 1024).toFixed(1)}GB`;
  }

  private logStart(): void {
    const memoryInfo = this.config.showMemoryUsage
      ? ` | Memory: ${this.formatMemory(this.metrics.memoryStart!.heapUsed)}`
      : '';

    console.log(`\n🚀 Starting ${this.taskName}...`);
    console.log(`📋 Total items: ${this.metrics.totalItems}${memoryInfo}`);
  }

  private logCompletion(): void {
    const duration = this.metrics.endTime! - this.metrics.startTime;
    const itemsPerSecond = Math.round(
      this.metrics.totalItems / (duration / 1000),
    );

    console.log(
      `\n✅ ${this.taskName} completed in ${this.formatDuration(duration)}`,
    );
    console.log(`📊 Summary:`);
    console.log(
      `   📈 Total processed: ${this.metrics.processedItems}/${this.metrics.totalItems}`,
    );
    console.log(`   ✨ Created: ${this.metrics.createdItems}`);
    console.log(`   🔄 Updated: ${this.metrics.updatedItems}`);
    console.log(`   ⏭️  Skipped: ${this.metrics.skippedItems}`);

    if (this.metrics.errorItems > 0) {
      console.log(`   ❌ Errors: ${this.metrics.errorItems}`);
    }

    console.log(`   ⚡ Rate: ${itemsPerSecond} items/second`);

    if (this.config.showMemoryUsage && this.metrics.memoryPeak) {
      const memoryDelta =
        this.metrics.memoryPeak.heapUsed - this.metrics.memoryStart!.heapUsed;
      console.log(
        `   💾 Memory peak: ${this.formatMemory(this.metrics.memoryPeak.heapUsed)} (+${this.formatMemory(memoryDelta)})`,
      );
    }

    // Show batch performance statistics
    if (this.metrics.batchSizes.length > 0) {
      const avgBatchSize = Math.round(
        this.metrics.batchSizes.reduce((a, b) => a + b, 0) /
          this.metrics.batchSizes.length,
      );
      const maxBatchSize = Math.max(...this.metrics.batchSizes);
      console.log(
        `   📦 Batch stats: Avg ${avgBatchSize}, Max ${maxBatchSize}, Batches: ${this.metrics.batchSizes.length}`,
      );
    }

    // Show error details if any
    if (this.metrics.errors.length > 0 && this.config.logLevel === 'verbose') {
      console.log(`\n⚠️  Error Details:`);
      this.metrics.errors.slice(0, 5).forEach((error, index) => {
        console.log(`   ${index + 1}. ${error.item}: ${error.error.message}`);
      });
      if (this.metrics.errors.length > 5) {
        console.log(`   ... and ${this.metrics.errors.length - 5} more errors`);
      }
    }
  }
}

/**
 * Helper function to create and manage progress tracking for async operations
 */
export async function withProgress<T>(
  taskName: string,
  totalItems: number,
  operation: (tracker: ProgressTracker) => Promise<T>,
  config?: ProgressConfig,
): Promise<{ result: T; metrics: SeedMetrics }> {
  const tracker = new ProgressTracker(taskName, totalItems, config);

  try {
    const result = await operation(tracker);
    const metrics = tracker.complete();
    return { result, metrics };
  } catch (error) {
    tracker.addNote(
      `Task failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error',
    );
    const metrics = tracker.complete();
    throw error;
  }
}

/**
 * Performance benchmarking utility
 */
export class PerformanceBenchmark {
  private checkpoints: Map<string, number> = new Map();
  private startTime: number = performance.now();

  checkpoint(name: string): number {
    const now = performance.now();
    const elapsed = now - this.startTime;
    this.checkpoints.set(name, elapsed);
    console.log(`🏁 Checkpoint [${name}]: ${elapsed.toFixed(2)}ms`);
    return elapsed;
  }

  getCheckpoint(name: string): number | undefined {
    return this.checkpoints.get(name);
  }

  getDuration(fromCheckpoint?: string): number {
    const startTime = fromCheckpoint
      ? (this.checkpoints.get(fromCheckpoint) ?? this.startTime)
      : this.startTime;
    return performance.now() - startTime;
  }

  summary(): void {
    console.log('\n📊 Performance Summary:');
    const sortedCheckpoints = Array.from(this.checkpoints.entries()).sort(
      (a, b) => a[1] - b[1],
    );

    let previousTime = 0;
    sortedCheckpoints.forEach(([name, time]) => {
      const interval = time - previousTime;
      console.log(
        `   ${name}: ${time.toFixed(2)}ms (+${interval.toFixed(2)}ms)`,
      );
      previousTime = time;
    });

    const totalTime = performance.now() - this.startTime;
    console.log(`   Total: ${totalTime.toFixed(2)}ms`);
  }
}
