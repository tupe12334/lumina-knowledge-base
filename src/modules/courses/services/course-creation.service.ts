import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course } from '../models/Course.entity';
import { CreateCourseInput } from '../dto/create-course.input';
import { CreateManyCoursesInput } from '../dto/create-many-courses.input';

@Injectable()
export class CourseCreationService {
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
}