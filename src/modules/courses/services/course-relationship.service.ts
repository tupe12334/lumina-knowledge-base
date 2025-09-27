import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCourseRelationshipInput } from '../dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from '../dto/delete-course-relationship.input';
import { CourseRelationshipResult } from '../dto/course-relationship-result.type';
import { createValidMetadataEntries } from './course-utils';

@Injectable()
export class CourseRelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a prerequisite/postrequisite relationship between two courses.
   * @param relationshipData - The relationship data containing course IDs and optional metadata
   * @returns The created relationship with full details
   */
  async createCourseRelationship(
    relationshipData: CreateCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    const { prerequisiteCourseId, postrequisiteCourseId, metadata } =
      relationshipData;

    this.validateRelationshipInput(prerequisiteCourseId, postrequisiteCourseId);
    const [prerequisiteCourse, postrequisiteCourse] = await this.validateCoursesExist(
      prerequisiteCourseId,
      postrequisiteCourseId,
    );
    await this.ensureRelationshipDoesNotExist(prerequisiteCourse.Block.id, postrequisiteCourse.Block.id);
    const relationship = await this.createBlockRelationship(prerequisiteCourse.Block.id, postrequisiteCourse.Block.id, metadata);

    return this.formatRelationshipResult(relationship);
  }

  private validateRelationshipInput(prerequisiteId: string, postrequisiteId: string) {
    if (prerequisiteId === postrequisiteId) {
      throw new BadRequestException(
        'A course cannot be a prerequisite to itself',
      );
    }
  }

  private async validateCoursesExist(prerequisiteId: string, postrequisiteId: string) {
    const [prerequisiteCourse, postrequisiteCourse] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: prerequisiteId },
        include: { Block: true },
      }),
      this.prisma.course.findUnique({
        where: { id: postrequisiteId },
        include: { Block: true },
      }),
    ]);

    if (!prerequisiteCourse) {
      throw new NotFoundException(
        `Prerequisite course with ID ${prerequisiteId} not found`,
      );
    }

    if (!postrequisiteCourse) {
      throw new NotFoundException(
        `Postrequisite course with ID ${postrequisiteId} not found`,
      );
    }

    return [prerequisiteCourse, postrequisiteCourse];
  }

  private async ensureRelationshipDoesNotExist(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    const existingRelationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });

    if (existingRelationship) {
      throw new BadRequestException(
        'Relationship already exists between these courses',
      );
    }
  }

  private async createBlockRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string, metadata?: Record<string, unknown>) {
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

  private formatRelationshipResult(relationship: any): CourseRelationshipResult {
    const formattedMetadata = relationship.metadata
      ? relationship.metadata.reduce(
          (acc: Record<string, string>, meta: any) => {
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

  /**
   * Deletes a prerequisite/postrequisite relationship between two courses.
   * @param relationshipData - The relationship data containing course IDs
   * @returns The deleted relationship with full details
   */
  async deleteCourseRelationship(
    relationshipData: DeleteCourseRelationshipInput,
  ): Promise<CourseRelationshipResult> {
    const { prerequisiteCourseId, postrequisiteCourseId } = relationshipData;

    const [prerequisiteCourse, postrequisiteCourse] = await this.validateCoursesExist(
      prerequisiteCourseId,
      postrequisiteCourseId,
    );
    const existingRelationship = await this.findExistingRelationship(
      prerequisiteCourse.Block.id,
      postrequisiteCourse.Block.id,
    );
    const result = this.formatRelationshipResult(existingRelationship);
    await this.deleteBlockRelationship(prerequisiteCourse.Block.id, postrequisiteCourse.Block.id);

    return result;
  }

  private async findExistingRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    const existingRelationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });

    if (!existingRelationship) {
      throw new NotFoundException(
        'Relationship not found between these courses',
      );
    }

    return existingRelationship;
  }

  private async deleteBlockRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    await this.prisma.blockRelationship.delete({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });
  }
}