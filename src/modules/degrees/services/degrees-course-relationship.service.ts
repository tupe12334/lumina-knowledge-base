import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Degree } from '../models/Degree.entity';

@Injectable()
export class DegreesCourseRelationshipService {
  constructor(private readonly prisma: PrismaService) {}

  async addCourse(degreeId: string, courseId: string): Promise<Degree> {
    await this.validateDegreeAndCourse(degreeId, courseId);

    await this.prisma.degree.update({
      where: { id: degreeId },
      data: {
        courses: {
          connect: { id: courseId },
        },
      },
    });

    const updatedDegree = await this.getDegreeWithDetails(degreeId);
    if (!updatedDegree) {
      throw new NotFoundException('Degree not found after update');
    }
    return updatedDegree;
  }

  async removeCourse(degreeId: string, courseId: string): Promise<Degree> {
    await this.validateDegreeAndCourse(degreeId, courseId);
    await this.validateCourseConnection(degreeId, courseId);

    await this.prisma.degree.update({
      where: { id: degreeId },
      data: {
        courses: {
          disconnect: { id: courseId },
        },
      },
    });

    const updatedDegree = await this.getDegreeWithDetails(degreeId);
    if (!updatedDegree) {
      throw new NotFoundException('Degree not found after update');
    }
    return updatedDegree;
  }

  async getCoursesByDegreeId(degreeId: string) {
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        courses: {
          include: {
            name: true,
          },
        },
      },
    });

    if (!degree) {
      throw new NotFoundException(`Degree with ID ${degreeId} not found`);
    }

    return degree.courses;
  }

  private async validateDegreeAndCourse(degreeId: string, courseId: string): Promise<void> {
    const degree = await this.prisma.degree.findUnique({ where: { id: degreeId } });
    if (!degree) {
      throw new NotFoundException(`Degree with ID ${degreeId} not found`);
    }

    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
  }

  private async validateCourseConnection(degreeId: string, courseId: string): Promise<void> {
    const degree = await this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: { courses: { where: { id: courseId } } },
    });

    if (!degree || degree.courses.length === 0) {
      throw new NotFoundException(
        `Course with ID ${courseId} is not associated with degree ${degreeId}`
      );
    }
  }

  private async getDegreeWithDetails(degreeId: string) {
    return this.prisma.degree.findUnique({
      where: { id: degreeId },
      include: {
        name: true,
        institution: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });
  }
}