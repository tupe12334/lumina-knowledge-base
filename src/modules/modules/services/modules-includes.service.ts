import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class ModulesIncludesService {
  getBaseInclude(): Prisma.ModuleInclude {
    return {
      name: true,
      Course: {
        include: {
          name: true,
          institution: {
            include: {
              name: true,
            },
          },
        },
      },
      subModules: { include: { name: true } },
      parentModules: { include: { name: true } },
    };
  }

  getDetailedInclude(): Prisma.ModuleInclude {
    return {
      name: true,
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
      },
      Questions: {
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
      },
      Course: {
        include: {
          name: true,
          institution: {
            include: {
              name: true,
            },
          },
        },
      },
      subModules: { include: { name: true } },
      parentModules: { include: { name: true } },
    };
  }

  getCourseModulesInclude(): Prisma.ModuleInclude {
    return {
      name: true,
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
      },
      Course: {
        include: {
          name: true,
          institution: {
            include: {
              name: true,
            },
          },
        },
      },
    };
  }
}