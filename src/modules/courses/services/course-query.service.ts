import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course } from '../models/Course.entity';
import { CoursesQueryInput } from '../dto/courses-query.input';

@Injectable()
export class CourseQueryService {
  constructor(private readonly prisma: PrismaService) {}

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
}