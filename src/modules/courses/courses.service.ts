import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RelationshipMetadataKey, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Course } from './models/Course.entity';
import { CreateCourseRelationshipInput } from './dto/create-course-relationship.input';
import { DeleteCourseRelationshipInput } from './dto/delete-course-relationship.input';
import { CourseRelationshipResult } from './dto/course-relationship-result.type';
import { DeleteCourseInput } from './dto/delete-course.input';
import { DeleteCourseResult } from './dto/delete-course-result.type';
import { UpdateCourseInput } from './dto/update-course.input';
import { SetCourseModulesInput } from './dto/set-course-modules.input';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateManyCoursesInput } from './dto/create-many-courses.input';
import { CoursesQueryInput } from './dto/courses-query.input';

/* eslint-disable @typescript-eslint/no-explicit-any */

function createValidMetadataEntries(metadata: Record<string, unknown>) {
  const validEntries: Array<{ key: RelationshipMetadataKey; value: string }> = [];
  for (const [key, value] of Object.entries(metadata)) {
    if (key === RelationshipMetadataKey.REASON ||
        key === RelationshipMetadataKey.TYPE ||
        key === RelationshipMetadataKey.DESCRIPTION) {
      const typedKey = key === RelationshipMetadataKey.REASON ? RelationshipMetadataKey.REASON :
                      key === RelationshipMetadataKey.TYPE ? RelationshipMetadataKey.TYPE :
                      RelationshipMetadataKey.DESCRIPTION;
      validEntries.push({ key: typedKey, value: String(value) });
    }
  }
  return validEntries;
}

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    const { name, universityId } = createCourseInput;
    return this.prisma.course.create({
      data: {
        institution: {
          connect: {
            id: universityId,
          },
        },
        name: {
          create: {
            en_text: name,
            he_text: name,
          },
        },
        Block: {
          create: {},
        },
      },
      include: {
        name: true,
      },
    });
  }

  /**
   * Creates multiple courses in a single transaction.
   * @param input - The data for creating multiple courses
   * @returns The number of courses created
   */
  async createMany(input: CreateManyCoursesInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const courseData of input.courses) {
        const { name, universityId } = courseData;
        await prisma.course.create({
          data: {
            institution: {
              connect: {
                id: universityId,
              },
            },
            name: {
              create: {
                en_text: name,
                he_text: name,
              },
            },
            Block: {
              create: {},
            },
          },
        });
        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async findAll(query?: CoursesQueryInput): Promise<Course[]> {
    const { universityId, degreeId, sortByDegree } = query || {};

    // Always fetch ALL courses, no filtering by where clause
    const courses = await this.prisma.course.findMany({
      include: {
        institution: { include: { name: true } },
        name: true,
        Block: {
          include: {
            postrequisiteOf: true,
            prerequisiteFor: true,
          },
        },
        Degree: true, // Include degrees to check if course belongs to user's degree
      },
    });

    // Sort courses in priority order: degree courses, then institution courses, then rest
    if (sortByDegree && (universityId || degreeId)) {
      return courses.sort((a, b) => {
        // Check if course belongs to user's degree
        const aInDegree = degreeId
          ? (a.Degree && a.Degree.some((d) => d.id === degreeId))
          : false;
        const bInDegree = degreeId
          ? (b.Degree && b.Degree.some((d) => d.id === degreeId))
          : false;

        // Check if course belongs to user's institution
        const aInUniversity = universityId
          ? a.institutionId === universityId
          : false;
        const bInUniversity = universityId
          ? b.institutionId === universityId
          : false;

        // Priority scoring: degree = 3, institution = 2, other = 1
        const aScore = aInDegree ? 3 : aInUniversity ? 2 : 1;
        const bScore = bInDegree ? 3 : bInUniversity ? 2 : 1;

        return bScore - aScore; // Sort in descending order (higher score first)
      });
    }

    return courses;
  }

  async findUnique(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        institution: { include: { name: true } },
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

    // Format metadata for response
    const formattedMetadata =
      relationship.metadata ? relationship.metadata.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} satisfies Record<string, string>,
      ) : {};

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
      existingRelationship.metadata ? existingRelationship.metadata.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} satisfies Record<string, string>,
      ) : {};

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

  /**
   * Deletes a course and cleans up all related data from the database.
   * This includes:
   * - Course relationships (prerequisites/postrequisites)
   * - Module relationships
   * - Questions associated with course modules
   * - Translation data
   * @param deleteData - The course deletion data containing course ID
   * @returns The deletion result with cleanup details
   */
  async deleteCourse(
    deleteData: DeleteCourseInput,
  ): Promise<DeleteCourseResult> {
    const { courseId, force = true } = deleteData;

    const course = await this.findCourseWithAllRelatedData(courseId);
    this.validateCourseDeletion(course, force);

    const result = await this.prisma.$transaction(async (tx) => {
      const counters = { deletedRelationships: 0, orphanedModules: 0, orphanedQuestions: 0 };

      await this.deleteCourseRelationships(tx, course, counters);
      await this.handleCourseModules(tx, course, courseId, counters);
      await this.deleteCourseAndBlock(tx, course, courseId);

      return {
        courseId,
        courseName: course.name.en_text || course.name.he_text,
        ...counters,
        success: true,
        message: `Successfully deleted course "${course.name.en_text || course.name.he_text}" and cleaned up ${counters.orphanedModules} modules, ${counters.orphanedQuestions} questions, ${counters.deletedRelationships} relationships.`,
      };
    });

    return result;
  }

  private async findCourseWithAllRelatedData(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        name: true,
        Block: {
          include: {
            prerequisiteFor: {
              include: {
                metadata: true,
              },
            },
            postrequisiteOf: {
              include: {
                metadata: true,
              },
            },
          },
        },
        modules: {
          include: {
            Questions: {
              include: {
                Answer: {
                  include: {
                    SelectAnswer: true,
                    UnitAnswer: true,
                    NumberAnswer: true,
                  },
                },
                Parts: true,
                PartOf: true,
              },
            },
            name: true,
            Block: {
              include: {
                prerequisiteFor: {
                  include: {
                    metadata: true,
                  },
                },
                postrequisiteOf: {
                  include: {
                    metadata: true,
                  },
                },
              },
            },
            Course: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    return course;
  }

  private validateCourseDeletion(course: any, force: boolean) {
    if (!force) {
      const hasRelationships =
        course.Block.prerequisiteFor.length > 0 ||
        course.Block.postrequisiteOf.length > 0;
      const hasModulesWithQuestions = course.modules.some(
        (module: any) => module.Questions.length > 0,
      );

      if (hasRelationships || hasModulesWithQuestions) {
        throw new BadRequestException(
          'Cannot delete course with existing relationships or questions. Use force=true to override.',
        );
      }
    }
  }

  private async deleteCourseRelationships(tx: any, course: any, counters: any) {
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

  private async handleCourseModules(tx: any, course: any, courseId: string, counters: any) {
    for (const module of course.modules) {
      const otherCourseModules = module.Course.filter(
        (c: any) => c.id !== courseId,
      );

      if (otherCourseModules.length === 0) {
        await this.deleteOrphanedModule(tx, module, counters);
      } else {
        await this.disconnectModuleFromCourse(tx, courseId, module.id);
      }
    }
  }

  private async deleteOrphanedModule(tx: any, module: any, counters: any) {
    counters.orphanedModules++;

    await this.deleteModuleQuestions(tx, module, counters);
    await this.deleteModuleRelationships(tx, module);
    await this.deleteModuleAndBlock(tx, module);
    await this.deleteModuleTranslationIfUnused(tx, module);
  }

  private async deleteModuleQuestions(tx: any, module: any, counters: any) {
    for (const question of module.Questions) {
      await tx.questionPart.deleteMany({
        where: {
          OR: [
            { questionId: question.id },
            { partQuestionId: question.id },
          ],
        },
      });

      await this.deleteQuestionAnswers(tx, question);
      await tx.question.delete({
        where: { id: question.id },
      });
      counters.orphanedQuestions++;
    }
  }

  private async deleteQuestionAnswers(tx: any, question: any) {
    for (const answer of question.Answer) {
      await tx.selectAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await tx.unitAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await tx.numberAnswer.deleteMany({
        where: { answerId: answer.id },
      });
      await tx.answer.delete({
        where: { id: answer.id },
      });
    }
  }

  private async deleteModuleRelationships(tx: any, module: any) {
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

  private async deleteModuleAndBlock(tx: any, module: any) {
    await tx.module.delete({
      where: { id: module.id },
    });
    await tx.block.delete({
      where: { id: module.Block.id },
    });
  }

  private async deleteModuleTranslationIfUnused(tx: any, module: any) {
    const translationUsage = await tx.module.findFirst({
      where: { translationId: module.translationId },
    });
    if (!translationUsage) {
      await tx.translation.delete({
        where: { id: module.translationId },
      });
    }
  }

  private async disconnectModuleFromCourse(tx: any, courseId: string, moduleId: string) {
    await tx.course.update({
      where: { id: courseId },
      data: {
        modules: {
          disconnect: { id: moduleId },
        },
      },
    });
  }

  private async deleteCourseAndBlock(tx: any, course: any, courseId: string) {
    await tx.course.delete({
      where: { id: courseId },
    });
    await tx.block.delete({
      where: { id: course.Block.id },
    });

    const translationUsage = await tx.course.findFirst({
      where: { translationId: course.translationId },
    });
    if (!translationUsage) {
      await tx.translation.delete({
        where: { id: course.translationId },
      });
    }
  }

  /**
   * Generic course update supporting translation and optional fields.
   * If no updatable fields are provided, throws BadRequest.
   */
  async updateCourse(input: UpdateCourseInput): Promise<Course> {
    const { courseId, enText, heText, universityId, publishedAt } = input;

    if (
      typeof enText !== 'string' &&
      typeof heText !== 'string' &&
      typeof universityId !== 'string' &&
      publishedAt == null
    ) {
      throw new BadRequestException('No fields provided to update');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        name: true,
        institution: { include: { name: true } },
        Block: true,
        modules: {
          include: {
            name: true,
            Block: true,
            subModules: true,
            parentModules: true,
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Perform updates in a transaction when multiple entities are involved
    await this.prisma.$transaction(async (tx) => {
      // Update translation if relevant
      if (typeof enText === 'string' || typeof heText === 'string') {
        await tx.translation.update({
          where: { id: course.translationId },
          data: {
            ...(typeof enText === 'string' ? { en_text: enText } : {}),
            ...(typeof heText === 'string' ? { he_text: heText } : {}),
          },
        });
      }

      // Update course fields
      if (typeof universityId === 'string' || publishedAt !== undefined) {
        await tx.course.update({
          where: { id: courseId },
          data: {
            ...(typeof universityId === 'string' ? { institutionId: universityId } : {}),
            ...(publishedAt !== undefined ? { publishedAt } : {}),
          },
        });
      }
    });

    // Return fresh course with updated data
    const updated = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        institution: { include: { name: true } },
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

    if (!updated) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found after update`,
      );
    }

    return updated;
  }

  /**
   * Sets the modules of a course, replacing any existing assignments.
   */
  async setCourseModules(input: SetCourseModulesInput): Promise<Course> {
    const { courseId, moduleIds } = input;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { name: true },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Optional validation: ensure all modules exist
    const existingModules = await this.prisma.module.findMany({
      where: { id: { in: moduleIds } },
      select: { id: true },
    });
    const existingIds = new Set(existingModules.map((m) => m.id));
    const missing = moduleIds.filter((id) => !existingIds.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Some modules do not exist: ${missing.join(', ')}`,
      );
    }

    // Update relation using set to replace existing associations
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        modules: {
          set: moduleIds.map((id) => ({ id })),
        },
      },
    });

    // Return fresh course with relations
    const updated = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        institution: { include: { name: true } },
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
              include: { name: true },
            },
            parentModules: {
              include: { name: true },
            },
          },
        },
      },
    });

    if (!updated) {
      throw new NotFoundException(
        `Course with ID ${courseId} not found after updating modules`,
      );
    }

    return updated;
  }

  /**
   * Generates a human-readable summary of a course including its university, degrees, modules, and prerequisites.
   * @param id - The course ID
   * @returns A plain text summary of the course
   * @throws NotFoundException if the course doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
      const course = await this.findCourseForSummary(id);

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      const summaryData = this.extractCourseSummaryData(course);
      return this.buildCourseSummary(course, summaryData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate course summary: ${error.message}`,
      );
    }
  }

  private async findCourseForSummary(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
        Degree: {
          include: {
            name: true,
          },
        },
        modules: {
          include: {
            name: true,
          },
        },
        Block: {
          include: {
            prerequisiteFor: {
              include: {
                postrequisite: {
                  include: {
                    Course: {
                      include: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
            postrequisiteOf: {
              include: {
                prerequisite: {
                  include: {
                    Course: {
                      include: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private extractCourseSummaryData(course: any) {
    const courseName =
      (course.name && course.name.en_text) || 'No English translation available';
    const universityName =
      (course.institution && course.institution.name && course.institution.name.en_text) || 'No English translation available';

    // Build associated degrees
    const degreeNames = course.Degree.map(
      (degree: any) => (degree.name && degree.name.en_text) || 'No English translation available',
    ).join(', ');

    // Build modules information
    const moduleCount = course.modules.length;
    const moduleNames = course.modules
      .map(
        (module: any) =>
          (module.name && module.name.en_text) || 'No English translation available',
      )
      .join(', ');

    const prerequisites = this.extractPrerequisites(course);
    const postrequisites = this.extractPostrequisites(course);

    return {
      courseName,
      universityName,
      degreeNames,
      moduleCount,
      moduleNames,
      prerequisites,
      postrequisites,
    };
  }

  private extractPrerequisites(course: any): string {
    if (!course.Block || !course.Block.postrequisiteOf) {
      return 'None';
    }

    const prerequisites = course.Block.postrequisiteOf
      .flatMap(
        (rel: any) =>
          (rel.prerequisite.Course && rel.prerequisite.Course.map(
            (c: any) => (c.name && c.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return prerequisites || 'None';
  }

  private extractPostrequisites(course: any): string {
    if (!course.Block || !course.Block.prerequisiteFor) {
      return 'None';
    }

    const postrequisites = course.Block.prerequisiteFor
      .flatMap(
        (rel: any) =>
          (rel.postrequisite.Course && rel.postrequisite.Course.map(
            (c: any) => (c.name && c.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return postrequisites || 'None';
  }

  private buildCourseSummary(course: any, data: any): string {
    return `Course: ${data.courseName}
ID: ${course.id}
Institution: ${data.universityName}
Associated Degrees: ${data.degreeNames || 'None'}
Modules: ${data.moduleCount} modules - ${data.moduleNames || 'None'}
Prerequisites: ${data.prerequisites}
Postrequisites: ${data.postrequisites}`;
  }
}
