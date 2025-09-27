import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/* eslint-disable @typescript-eslint/no-explicit-any */

@Injectable()
export class ModulesSummaryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a human-readable summary of a module including its courses, questions, hierarchy, and prerequisites.
   * @param id - The module ID
   * @returns A plain text summary of the module
   * @throws NotFoundException if the module doesn't exist
   * @throws InternalServerErrorException if database operation fails
   */
  async generateSummary(id: string): Promise<string> {
    try {
      const module = await this.findModuleForSummary(id);

      if (!module) {
        throw new NotFoundException(`Module with ID ${id} not found`);
      }

      const summaryData = this.extractModuleSummaryData(module);
      return this.buildModuleSummary(module, summaryData);
    } catch (error: unknown) {
      if (error instanceof NotFoundException && error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate module summary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async getModulesSummary(): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    const modules = await this.prisma.module.findMany({
      include: {
        name: true,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    return modules
      .map((module) => ({
        id: module.id,
        en_name: module.name.en_text,
        questions_amount: module._count.Questions,
      }))
      .sort((a, b) => a.questions_amount - b.questions_amount);
  }

  async getModulesByQuestionCount(limit?: number): Promise<
    Array<{ id: string; en_name: string; questions_amount: number }>
  > {
    const modules = await this.prisma.module.findMany({
      include: {
        name: true,
        _count: {
          select: {
            Questions: true,
          },
        },
      },
    });

    const sortedModules = modules
      .map((module) => ({
        id: module.id,
        en_name: module.name.en_text,
        questions_amount: module._count.Questions,
      }))
      .sort((a, b) => a.questions_amount - b.questions_amount);

    return limit ? sortedModules.slice(0, limit) : sortedModules;
  }

  private async findModuleForSummary(id: string) {
    return this.prisma.module.findUnique({
      where: { id },
      include: {
        name: true,
        Course: {
          include: {
            name: true,
          },
        },
        Questions: true,
        parentModules: {
          include: {
            name: true,
          },
        },
        subModules: {
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
                    Module: {
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
                    Module: {
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

  private extractModuleSummaryData(module: any) {
    const moduleName =
      (module.name && module.name.en_text) || 'No English translation available';

    const courseNames = module.Course.map(
      (course: any) => (course.name && course.name.en_text) || 'No English translation available',
    ).join(', ');

    const questionCount = module.Questions.length;
    const questionTypes = [
      ...new Set(module.Questions.map((q: any) => q.type)),
    ].join(', ');

    const parentModuleNames = module.parentModules
      .map(
        (parent: any) =>
          (parent.name && parent.name.en_text) || 'No English translation available',
      )
      .join(', ');

    const subModuleNames = module.subModules
      .map((sub: any) => (sub.name && sub.name.en_text) || 'No English translation available')
      .join(', ');

    const prerequisites = this.extractModulePrerequisites(module);
    const postrequisites = this.extractModulePostrequisites(module);

    return {
      moduleName,
      courseNames,
      questionCount,
      questionTypes,
      parentModuleNames,
      subModuleNames,
      prerequisites,
      postrequisites,
    };
  }

  private extractModulePrerequisites(module: any): string {
    if (!module.Block || !module.Block.postrequisiteOf) {
      return 'None';
    }

    const prerequisites = module.Block.postrequisiteOf
      .flatMap(
        (rel: any) =>
          (rel.prerequisite.Module && rel.prerequisite.Module.map(
            (m: any) => (m.name && m.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return prerequisites || 'None';
  }

  private extractModulePostrequisites(module: any): string {
    if (!module.Block || !module.Block.prerequisiteFor) {
      return 'None';
    }

    const postrequisites = module.Block.prerequisiteFor
      .flatMap(
        (rel: any) =>
          (rel.postrequisite.Module && rel.postrequisite.Module.map(
            (m: any) => (m.name && m.name.en_text) || 'No English translation available',
          )) || [],
      )
      .filter((name: string) => name !== 'No English translation available')
      .join(', ');

    return postrequisites || 'None';
  }

  private buildModuleSummary(module: any, data: any): string {
    return `Module: ${data.moduleName}
ID: ${module.id}
Associated Courses: ${data.courseNames || 'None'}
Questions: ${data.questionCount} questions of types ${data.questionTypes || 'None'}
Parent Modules: ${data.parentModuleNames || 'None'}
Sub-modules: ${data.subModuleNames || 'None'}
Prerequisites: ${data.prerequisites}
Postrequisites: ${data.postrequisites}`;
  }
}