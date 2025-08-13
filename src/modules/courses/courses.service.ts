import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RelationshipMetadataKey } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Course } from './models/Course.entity';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { CourseRelationshipResult } from './dto/course-relationship-result.type';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      include: {
        university: { include: { name: true } },
        name: true,
        Block: {
          include: {
            postrequisiteOf: true,
            prerequisiteFor: true,
          },
        },
      },
    });

    return courses;
  }

  async findUnique(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        university: { include: { name: true } },
        name: true,
        Block: {
          include: {
            postrequisiteOf: true,
            prerequisiteFor: true,
          },
        },
        modules: {
          include: {
            name: true,
            Block: {
              include: {
                postrequisiteOf: true,
                prerequisiteFor: true,
              },
            },
            subModules: {
              include: {
                name: true,
                subModules: {
                  include: {
                    name: true,
                  },
                },
              },
            },
            parentModules: {
              include: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return null;
    }

    return course;
  }

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

    if (prerequisiteCourseId === postrequisiteCourseId) {
      throw new BadRequestException(
        'A course cannot be a prerequisite to itself',
      );
    }

    // Validate that both courses exist
    const [prerequisiteCourse, postrequisiteCourse] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: prerequisiteCourseId },
        include: { Block: true },
      }),
      this.prisma.course.findUnique({
        where: { id: postrequisiteCourseId },
        include: { Block: true },
      }),
    ]);

    if (!prerequisiteCourse) {
      throw new NotFoundException(
        `Prerequisite course with ID ${prerequisiteCourseId} not found`,
      );
    }

    if (!postrequisiteCourse) {
      throw new NotFoundException(
        `Postrequisite course with ID ${postrequisiteCourseId} not found`,
      );
    }

    // Check if relationship already exists
    const existingRelationship = await this.prisma.blockRelationship.findUnique(
      {
        where: {
          prerequisiteId_postrequisiteId: {
            prerequisiteId: prerequisiteCourse.Block.id,
            postrequisiteId: postrequisiteCourse.Block.id,
          },
        },
      },
    );

    if (existingRelationship) {
      throw new BadRequestException(
        'Relationship already exists between these courses',
      );
    }

    // Create the relationship
    const relationship = await this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisiteCourse.Block.id,
        postrequisiteId: postrequisiteCourse.Block.id,
        metadata: metadata
          ? {
              create: Object.entries(metadata).map(([key, value]) => ({
                key: key as RelationshipMetadataKey,
                value: String(value),
              })),
            }
          : undefined,
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });

    // Format metadata for response
    const formattedMetadata =
      relationship.metadata?.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

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

    // Validate that both courses exist
    const [prerequisiteCourse, postrequisiteCourse] = await Promise.all([
      this.prisma.course.findUnique({
        where: { id: prerequisiteCourseId },
        include: { Block: true },
      }),
      this.prisma.course.findUnique({
        where: { id: postrequisiteCourseId },
        include: { Block: true },
      }),
    ]);

    if (!prerequisiteCourse) {
      throw new NotFoundException(
        `Prerequisite course with ID ${prerequisiteCourseId} not found`,
      );
    }

    if (!postrequisiteCourse) {
      throw new NotFoundException(
        `Postrequisite course with ID ${postrequisiteCourseId} not found`,
      );
    }

    // Find the relationship to delete
    const existingRelationship = await this.prisma.blockRelationship.findUnique(
      {
        where: {
          prerequisiteId_postrequisiteId: {
            prerequisiteId: prerequisiteCourse.Block.id,
            postrequisiteId: postrequisiteCourse.Block.id,
          },
        },
        include: {
          prerequisite: true,
          postrequisite: true,
          metadata: true,
        },
      },
    );

    if (!existingRelationship) {
      throw new NotFoundException(
        'Relationship not found between these courses',
      );
    }

    // Format metadata for response before deletion
    const formattedMetadata =
      existingRelationship.metadata?.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    // Delete the relationship
    await this.prisma.blockRelationship.delete({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteCourse.Block.id,
          postrequisiteId: postrequisiteCourse.Block.id,
        },
      },
    });

    return {
      id: existingRelationship.id,
      prerequisite: existingRelationship.prerequisite,
      postrequisite: existingRelationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}
