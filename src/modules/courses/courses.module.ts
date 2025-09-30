import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { ModulesModule } from '../modules/modules.module';
import { CoursesController } from './courses.controller';
import { CoursesRelationshipController } from './controllers/courses-relationship.controller';
import { CoursesModuleController } from './controllers/courses-module.controller';
import { CourseRelationshipService } from './services/course-relationship.service';
import { CourseRelationshipValidatorService } from './services/course-relationship-validator.service';
import { CourseRelationshipDatabaseService } from './services/course-relationship-database.service';
import { CourseDeletionService } from './services/course-deletion.service';
import { CourseDeletionQueryService } from './services/course-deletion-query.service';
import { CourseDeletionRelationshipService } from './services/course-deletion-relationship.service';
import { CourseDeletionModuleService } from './services/course-deletion-module.service';
import { CourseDeletionQuestionService } from './services/course-deletion-question.service';
import { CourseDeletionEntityService } from './services/course-deletion-entity.service';
import { CourseDeletionConnectorService } from './services/course-deletion-connector.service';
import { CourseSummaryService } from './services/course-summary.service';
import { CourseUpdateService } from './services/course-update.service';
import { CourseModuleService } from './services/course-module.service';
import { CourseCreationService } from './services/course-creation.service';
import { CourseQueryService } from './services/course-query.service';
import { CourseIncludesService } from './services/course-includes.service';
import { CourseTextFormatterService } from './services/course-text-formatter.service';

@Module({
  imports: [PrismaModule, ModulesModule],
  providers: [
    CoursesService,
    CourseRelationshipService,
    CourseRelationshipValidatorService,
    CourseRelationshipDatabaseService,
    CourseDeletionService,
    CourseDeletionQueryService,
    CourseDeletionRelationshipService,
    CourseDeletionModuleService,
    CourseDeletionQuestionService,
    CourseDeletionEntityService,
    CourseDeletionConnectorService,
    CourseSummaryService,
    CourseUpdateService,
    CourseModuleService,
    CourseCreationService,
    CourseQueryService,
    CourseIncludesService,
    CourseTextFormatterService,
  ],
  controllers: [
    CoursesController,
    CoursesRelationshipController,
    CoursesModuleController,
  ],
})
export class CoursesModule {}
