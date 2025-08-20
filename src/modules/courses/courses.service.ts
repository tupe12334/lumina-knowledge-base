import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RelationshipMetadataKey } from '@prisma/client';
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

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCourseInput: CreateCourseInput): Promise<Course> {
    const { name, universityId } = createCourseInput;
    return this.prisma.course.create({
      data: {
        university: {
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

    // First, verify the course exists and get all related data
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
            Course: true, // To check if modules are used by other courses
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if we should proceed without force flag
    if (!force) {
      const hasRelationships =
        course.Block.prerequisiteFor.length > 0 ||
        course.Block.postrequisiteOf.length > 0;
      const hasModulesWithQuestions = course.modules.some(
        (module) => module.Questions.length > 0,
      );

      if (hasRelationships || hasModulesWithQuestions) {
        throw new BadRequestException(
          'Cannot delete course with existing relationships or questions. Use force=true to override.',
        );
      }
    }

    // Start the deletion process in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      let deletedRelationships = 0;
      let orphanedModules = 0;
      let orphanedQuestions = 0;

      // 1. Delete all course relationships (prerequisites/postrequisites)
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
        // Delete relationship metadata first
        await tx.relationshipMetadata.deleteMany({
          where: { blockRelationshipId: relationship.id },
        });

        // Delete the relationship
        await tx.blockRelationship.delete({
          where: { id: relationship.id },
        });

        deletedRelationships++;
      }

      // 2. Handle modules and their data
      for (const module of course.modules) {
        // Check if this module is used by other courses
        const otherCourseModules = module.Course.filter(
          (c) => c.id !== courseId,
        );

        if (otherCourseModules.length === 0) {
          // Module is only used by this course, we can delete it
          orphanedModules++;

          // Delete questions associated with this module
          for (const question of module.Questions) {
            // Delete question parts relationships
            await tx.questionPart.deleteMany({
              where: {
                OR: [
                  { questionId: question.id },
                  { partQuestionId: question.id },
                ],
              },
            });

            // Delete answers and their sub-answers
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

            // Delete the question
            await tx.question.delete({
              where: { id: question.id },
            });

            orphanedQuestions++;
          }

          // Delete module relationships
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

          // Delete the module
          await tx.module.delete({
            where: { id: module.id },
          });

          // Delete module's block
          await tx.block.delete({
            where: { id: module.Block.id },
          });

          // Delete module's translation if not used elsewhere
          const translationUsage = await tx.module.findFirst({
            where: { translationId: module.translationId },
          });
          if (!translationUsage) {
            await tx.translation.delete({
              where: { id: module.translationId },
            });
          }
        } else {
          // Module is used by other courses, just remove the relationship
          await tx.course.update({
            where: { id: courseId },
            data: {
              modules: {
                disconnect: { id: module.id },
              },
            },
          });
        }
      }

      // 3. Delete the course itself
      await tx.course.delete({
        where: { id: courseId },
      });

      // 4. Delete course's block
      await tx.block.delete({
        where: { id: course.Block.id },
      });

      // 5. Delete course's translation if not used elsewhere
      const translationUsage = await tx.course.findFirst({
        where: { translationId: course.translationId },
      });
      if (!translationUsage) {
        await tx.translation.delete({
          where: { id: course.translationId },
        });
      }

      return {
        courseId,
        courseName: course.name.en_text || course.name.he_text,
        deletedRelationships,
        orphanedModules,
        orphanedQuestions,
        success: true,
        message: `Successfully deleted course "${course.name.en_text || course.name.he_text}" and cleaned up ${orphanedModules} modules, ${orphanedQuestions} questions, ${deletedRelationships} relationships.`,
      };
    });

    return result;
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
        university: { include: { name: true } },
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
            ...(typeof universityId === 'string' ? { universityId } : {}),
            ...(publishedAt !== undefined ? { publishedAt } : {}),
          },
        });
      }
    });

    // Return fresh course with updated data
    const updated = await this.prisma.course.findUnique({
      where: { id: courseId },
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
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          name: true,
          university: {
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

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      const courseName =
        course.name?.en_text || 'No English translation available';
      const universityName =
        course.university?.name?.en_text || 'No English translation available';

      // Build associated degrees
      const degreeNames = course.Degree.map(
        (degree) => degree.name?.en_text || 'No English translation available',
      ).join(', ');

      // Build modules information
      const moduleCount = course.modules.length;
      const moduleNames = course.modules
        .map(
          (module) => module.name?.en_text || 'No English translation available',
        )
        .join(', ');

      // Build prerequisites and postrequisites (simplified for now)
      const prerequisites = 'None';
      const postrequisites = 'None';

      const summary = `Course: ${courseName}
ID: ${course.id}
University: ${universityName}
Associated Degrees: ${degreeNames || 'None'}
Modules: ${moduleCount} modules - ${moduleNames || 'None'}
Prerequisites: ${prerequisites}
Postrequisites: ${postrequisites}`;

      return summary;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate course summary: ${error.message}`,
      );
    }
  }
}
