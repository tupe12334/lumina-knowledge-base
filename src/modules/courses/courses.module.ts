import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { ModulesModule } from '../modules/modules.module';
import { CoursesController } from './courses.controller';
import { CourseRelationshipService } from './services/course-relationship.service';
import { CourseDeletionService } from './services/course-deletion.service';
import { CourseDeletionQueryService } from './services/course-deletion-query.service';
import { CourseDeletionRelationshipService } from './services/course-deletion-relationship.service';
import { CourseDeletionModuleService } from './services/course-deletion-module.service';
import { CourseSummaryService } from './services/course-summary.service';
import { CourseUpdateService } from './services/course-update.service';
import { CourseCreationService } from './services/course-creation.service';
import { CourseQueryService } from './services/course-query.service';
import { CourseIncludesService } from './services/course-includes.service';
import { CourseTextFormatterService } from './services/course-text-formatter.service';

@Module({
  imports: [PrismaModule, ModulesModule],
  providers: [
    CoursesService,
    CourseRelationshipService,
    CourseDeletionService,
    CourseDeletionQueryService,
    CourseDeletionRelationshipService,
    CourseDeletionModuleService,
    CourseSummaryService,
    CourseUpdateService,
    CourseCreationService,
    CourseQueryService,
    CourseIncludesService,
    CourseTextFormatterService,
  ],
  controllers: [CoursesController],
})
export class CoursesModule {}
