import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

const execAsync = promisify(exec);

@Injectable()
export class DatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createDump(): Promise<string> {
    try {
      // Get the database path from the current working directory
      const dbPath = join(process.cwd(), 'prisma', 'main.db');

      // Execute sqlite3 dump command
      const { stdout, stderr } = await execAsync(`sqlite3 "${dbPath}" .dump`);

      if (stderr) {
        throw new Error(`SQLite dump error: ${stderr}`);
      }

      return stdout;
    } catch (error) {
      throw new Error(
        `Failed to create database dump: ${(error as Error).message}`,
      );
    }
  }

  async getDatabaseInfo() {
    try {
      // Get basic database statistics
      const [
        coursesCount,
        modulesCount,
        universitiesCount,
        degreesCount,
        questionsCount,
        blocksCount,
      ] = await Promise.all([
        this.prisma.course.count(),
        this.prisma.module.count(),
        this.prisma.institution.count(),
        this.prisma.degree.count(),
        this.prisma.question.count(),
        this.prisma.block.count(),
      ]);

      // Get database file size
      const dbPath = join(process.cwd(), 'prisma', 'main.db');
      let dbSize = 0;

      try {
        const { stdout } = await execAsync(
          `stat -f%z "${dbPath}" 2>/dev/null || stat -c%s "${dbPath}" 2>/dev/null || echo 0`,
        );
        dbSize = parseInt(stdout.trim(), 10) || 0;
      } catch {
        // Fallback if stat command fails
        dbSize = 0;
      }

      return {
        statistics: {
          courses: coursesCount,
          modules: modulesCount,
          universities: universitiesCount,
          degrees: degreesCount,
          questions: questionsCount,
          blocks: blocksCount,
        },
        database: {
          type: 'SQLite',
          path: dbPath,
          size: dbSize,
          sizeFormatted: this.formatBytes(dbSize),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(
        `Failed to get database info: ${(error as Error).message}`,
      );
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
