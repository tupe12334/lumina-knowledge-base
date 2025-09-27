import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModulesService } from './modules.service';
import { QuestionsModule } from '../questions/questions.module';
import { ModulesController } from './modules.controller';
import { ModulesQueryService } from './services/modules-query.service';
import { ModulesCrudService } from './services/modules-crud.service';
import { ModulesRelationshipService } from './services/modules-relationship.service';
import { ModulesSummaryService } from './services/modules-summary.service';
import { ModulesQueryBuilderService } from './services/modules-query-builder.service';
import { ModulesFilterService } from './services/modules-filter.service';
import { ModulesIncludesService } from './services/modules-includes.service';
import { ModulesQuestionFilterService } from './services/modules-question-filter.service';
import { ModulesStatsService } from './services/modules-stats.service';
import { ModulesTextSummaryService } from './services/modules-text-summary.service';
import { ModulesRelationshipHelperService } from './services/modules-relationship-helper.service';

@Module({
  imports: [PrismaModule, QuestionsModule],
  providers: [
    ModulesService,
    ModulesQueryService,
    ModulesCrudService,
    ModulesRelationshipService,
    ModulesSummaryService,
    ModulesQueryBuilderService,
    ModulesFilterService,
    ModulesIncludesService,
    ModulesQuestionFilterService,
    ModulesStatsService,
    ModulesTextSummaryService,
    ModulesRelationshipHelperService,
  ],
  exports: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}
