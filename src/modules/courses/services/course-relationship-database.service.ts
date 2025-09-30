import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseRelationshipResult } from '../dto/course-relationship-result.type';
import { createValidMetadataEntries } from '../../blocks/helpers/create-valid-metadata-entries.helper';
import { Block } from '../../blocks/models/Block.entity';

@Injectable()
export class CourseRelationshipDatabaseService {
  constructor(private readonly prisma: PrismaService) {}

  async createBlockRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string, metadata?: Record<string, unknown>) {
    return this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisiteBlockId,
        postrequisiteId: postrequisiteBlockId,
        metadata: metadata
          ? {
              create: createValidMetadataEntries(metadata),
            }
          : undefined,
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });
  }

  async deleteBlockRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    await this.prisma.blockRelationship.delete({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });
  }

  formatRelationshipResult(relationship: {
    id: string;
    prerequisite: Block;
    postrequisite: Block;
    metadata?: Array<{ key: string; value: string }>;
  }): CourseRelationshipResult {

    const formattedMetadata = relationship.metadata
      ? relationship.metadata.reduce(
          (acc: Record<string, string>, meta: { key: string; value: string }) => {
            acc[meta.key] = meta.value;
            return acc;
          },
          {} satisfies Record<string, string>,
        )
      : {};

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}