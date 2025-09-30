import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
@Injectable()
export class ModulesIncludesService {
  private getCourseInclude() {
    return {
      include: {
        name: true,
        institution: {
          include: {
            name: true,
          },
        },
      },
    };
  }

  private getModuleRelationshipsInclude() {
    return {
      subModules: { include: { name: true } },
      parentModules: { include: { name: true } },
    };
  }

  getBaseInclude(): Prisma.ModuleInclude {
    return {
      name: true,
      Course: this.getCourseInclude(),
      ...this.getModuleRelationshipsInclude(),
    };
  }

  private getBlockInclude() {
    return {
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
            metadata: true,
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
            metadata: true,
          },
        },
      },
    };
  }

  private getQuestionsInclude() {
    return {
      include: {
        text: true,
        Answer: {
          include: {
            SelectAnswer: true,
            UnitAnswer: true,
            NumberAnswer: true,
            BooleanAnswer: true,
          },
        },
        Parts: true,
      },
    };
  }

  getDetailedInclude(): Prisma.ModuleInclude {
    return {
      name: true,
      Block: this.getBlockInclude(),
      Questions: this.getQuestionsInclude(),
      Course: this.getCourseInclude(),
      ...this.getModuleRelationshipsInclude(),
    };
  }

  getCourseModulesInclude(): Prisma.ModuleInclude {
    return {
      name: true,
      Course: this.getCourseInclude(),
    };
  }
}