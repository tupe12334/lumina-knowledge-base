import { Injectable } from '@nestjs/common';
import { CourseDeletionRelationshipService } from './course-deletion-relationship.service';
import { CourseDeletionQuestionService } from './course-deletion-question.service';
import { CourseDeletionEntityService } from './course-deletion-entity.service';
import { CourseDeletionConnectorService } from './course-deletion-connector.service';
import { CourseDeletionTransaction, ModuleForDeletion, CourseWithModules } from '../types/course-deletion.types';

interface DeletionCounters {
  deletedRelationships: number;
  orphanedModules: number;
  orphanedQuestions: number;
}

@Injectable()
export class CourseDeletionModuleService {
  constructor(
    private readonly relationshipService: CourseDeletionRelationshipService,
    private readonly questionService: CourseDeletionQuestionService,
    private readonly entityService: CourseDeletionEntityService,
    private readonly connectorService: CourseDeletionConnectorService,
  ) {}

  async handleCourseModules(tx: CourseDeletionTransaction, course: CourseWithModules, courseId: string, counters: DeletionCounters) {
    for (const module of course.modules) {
      const otherCourseModules = module.Course.filter(
        (c) => c.id !== courseId,
      );

      if (otherCourseModules.length === 0) {
        await this.deleteOrphanedModule(tx, module, counters);
      } else {
        await this.connectorService.disconnectModuleFromCourse(tx, courseId, module.id);
      }
    }
  }

  private async deleteOrphanedModule(tx: CourseDeletionTransaction, module: ModuleForDeletion, counters: DeletionCounters) {
    counters.orphanedModules++;

    await this.questionService.deleteModuleQuestions(tx, module, counters);
    await this.relationshipService.deleteModuleRelationships(tx, module);
    await this.entityService.deleteModuleAndBlock(tx, module);
    await this.entityService.deleteModuleTranslationIfUnused(tx, module);
  }

}