import { Injectable } from '@nestjs/common';

interface DeletionCounters {
  deletedRelationships: number;
  orphanedModules: number;
  orphanedQuestions: number;
}

@Injectable()
export class CourseDeletionRelationshipService {
  async deleteCourseRelationships(tx: unknown, course: unknown, counters: DeletionCounters) {
    const typedTx = tx as {
      blockRelationship: {
        findMany: (args: unknown) => Promise<Array<{ id: string; metadata: unknown }>>;
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
      relationshipMetadata: {
        deleteMany: (args: { where: { blockRelationshipId: string } }) => Promise<unknown>;
      };
    };

    const typedCourse = course as {
      Block: { id: string };
    };

    const courseRelationships = await typedTx.blockRelationship.findMany({
      where: {
        OR: [
          { prerequisiteId: typedCourse.Block.id },
          { postrequisiteId: typedCourse.Block.id },
        ],
      },
      include: {
        metadata: true,
      },
    });

    for (const relationship of courseRelationships) {
      await typedTx.relationshipMetadata.deleteMany({
        where: { blockRelationshipId: relationship.id },
      });
      await typedTx.blockRelationship.delete({
        where: { id: relationship.id },
      });
      counters.deletedRelationships++;
    }
  }

  async deleteModuleRelationships(tx: unknown, module: unknown) {
    const typedTx = tx as {
      blockRelationship: {
        findMany: (args: unknown) => Promise<Array<{ id: string; metadata: unknown }>>;
        delete: (args: { where: { id: string } }) => Promise<unknown>;
      };
      relationshipMetadata: {
        deleteMany: (args: { where: { blockRelationshipId: string } }) => Promise<unknown>;
      };
    };

    const typedModule = module as {
      Block: { id: string };
    };

    const moduleRelationships = await typedTx.blockRelationship.findMany({
      where: {
        OR: [
          { prerequisiteId: typedModule.Block.id },
          { postrequisiteId: typedModule.Block.id },
        ],
      },
      include: {
        metadata: true,
      },
    });

    for (const relationship of moduleRelationships) {
      await typedTx.relationshipMetadata.deleteMany({
        where: { blockRelationshipId: relationship.id },
      });
      await typedTx.blockRelationship.delete({
        where: { id: relationship.id },
      });
    }
  }
}