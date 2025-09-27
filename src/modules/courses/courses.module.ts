import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { ModulesModule } from '../modules/modules.module';
import { CoursesController } from './courses.controller';
import { CourseRelationshipService } from './services/course-relationship.service';
import { CourseDeletionService } from './services/course-deletion.service';
import { CourseSummaryService } from './services/course-summary.service';
import { CourseUpdateService } from './services/course-update.service';
import { CourseCreationService } from './services/course-creation.service';
import { CourseQueryService } from './services/course-query.service';

@Module({
  imports: [PrismaModule, ModulesModule],
  providers: [CoursesService, CourseRelationshipService, CourseDeletionService, CourseSummaryService, CourseUpdateService, CourseCreationService, CourseQueryService],
  controllers: [CoursesController],
})
export class CoursesModule {}
