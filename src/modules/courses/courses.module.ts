import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { ModulesModule } from '../modules/modules.module';
import { CoursesController } from './courses.controller';
import { CourseRelationshipService } from './services/course-relationship.service';

@Module({
  imports: [PrismaModule, ModulesModule],
  providers: [CoursesService, CourseRelationshipService],
  controllers: [CoursesController],
})
export class CoursesModule {}
