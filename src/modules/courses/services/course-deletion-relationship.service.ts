import { Injectable } from '@nestjs/common';
import {
  CourseDeletionTransaction,
  CourseWithModules,
  ModuleWithBlock
} from '../types/course-deletion.types';

interface DeletionCounters {
  deletedRelationships: number;
  orphanedModules: number;
  orphanedQuestions: number;
}

@Injectable()
export class CourseDeletionRelationshipService {
  async deleteCourseRelationships(tx: CourseDeletionTransaction, course: CourseWithModules, counters: DeletionCounters) {
    const courseRelationships = await tx.blockRelationship.findMany({
      where: {
        OR: [
          { prerequisiteId: course.Block.id },
          { postrequisiteId: course.Block.id },
        ],
      },
      include: {
        metadata: true,
      },
    });

    for (const relationship of courseRelationships) {
      await tx.relationshipMetadata.deleteMany({
        where: { blockRelationshipId: relationship.id },
      });
      await tx.blockRelationship.delete({
        where: { id: relationship.id },
      });
      counters.deletedRelationships++;
    }
  }

  async deleteModuleRelationships(tx: CourseDeletionTransaction, module: ModuleWithBlock) {
    const moduleRelationships = await tx.blockRelationship.findMany({
      where: {
        OR: [
          { prerequisiteId: module.Block.id },
          { postrequisiteId: module.Block.id },
        ],
      },
      include: {
        metadata: true,
      },
    });

    for (const relationship of moduleRelationships) {
      await tx.relationshipMetadata.deleteMany({
        where: { blockRelationshipId: relationship.id },
      });
      await tx.blockRelationship.delete({
        where: { id: relationship.id },
      });
    }
  }
}