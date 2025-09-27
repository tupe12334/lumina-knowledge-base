import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ModulesDataExtractorService } from './modules-data-extractor.service';
import { ModulesTextBuilderService } from './modules-text-builder.service';

@Injectable()
export class ModulesTextSummaryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataExtractor: ModulesDataExtractorService,
    private readonly textBuilder: ModulesTextBuilderService,
  ) {}

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

      const summaryData = this.dataExtractor.extractModuleSummaryData(module);
      return this.textBuilder.buildModuleSummary(module, summaryData);
    } catch (error: unknown) {
      if (error instanceof NotFoundException && error instanceof Error) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        `Failed to generate module summary: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
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

}