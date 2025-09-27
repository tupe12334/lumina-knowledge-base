import { Injectable } from '@nestjs/common';
import { ModulesStatsService } from './modules-stats.service';
import { ModulesTextSummaryService } from './modules-text-summary.service';

@Injectable()
export class ModulesSummaryService {
  constructor(
    private readonly statsService: ModulesStatsService,
    private readonly textSummaryService: ModulesTextSummaryService,
  ) {}

  async generateSummary(id: string): Promise<string> {
    return this.textSummaryService.generateSummary(id);
  }

  async getModulesSummary(): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    return this.statsService.getModulesSummary();
  }

  async getModulesByQuestionCount(limit?: number): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    return this.statsService.getModulesByQuestionCount(limit);
  }
}