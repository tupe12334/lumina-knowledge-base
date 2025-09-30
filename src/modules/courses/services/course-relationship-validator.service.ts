import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CourseRelationshipValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  validateRelationshipInput(prerequisiteId: string, postrequisiteId: string) {
    if (prerequisiteId === postrequisiteId) {
      throw new BadRequestException(
        'A course cannot be a prerequisite to itself',
      );
    }
  }

  async validateCoursesExist(prerequisiteId: string, postrequisiteId: string) {
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

  async ensureRelationshipDoesNotExist(prerequisiteBlockId: string, postrequisiteBlockId: string) {
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

  async findExistingRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
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
}