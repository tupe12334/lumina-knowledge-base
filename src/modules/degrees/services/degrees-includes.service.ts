import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class DegreesIncludesService {
  getBaseInclude(): Prisma.DegreeInclude {
    return {
      name: true,
      institution: {
        include: {
          name: true,
        },
      },
      faculty: {
        include: {
          name: true,
          description: true,
        },
      },
      courses: {
        include: {
          name: true,
        },
      },
    };
  }

  getDetailedInclude(): Prisma.DegreeInclude {
    return {
      name: true,
      institution: {
        include: {
          name: true,
        },
      },
      faculty: {
        include: {
          name: true,
          description: true,
        },
      },
      courses: {
        include: {
          name: true,
          Block: {
            include: {
              postrequisiteOf: true,
              prerequisiteFor: true,
            },
          },
        },
      },
    };
  }
}