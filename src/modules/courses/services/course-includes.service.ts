import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CourseIncludesService {
  getSummaryInclude(): Prisma.CourseInclude {
    return {
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
    };
  }

  getCourseDetailsInclude(): Prisma.CourseInclude {
    return {
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
          subModules: { include: { name: true } },
          parentModules: { include: { name: true } },
        },
      },
    };
  }
}