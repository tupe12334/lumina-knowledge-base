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
}