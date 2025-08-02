import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { University } from './models/University.entity';

@Injectable()
export class UniversitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<University[]> {
    const universities = await this.prisma.university.findMany({
      include: {
        courses: {
          include: { name: true },
        },
        name: true,
        Degree: {
          include: { name: true },
        },
      },
    });

    return universities;
  }

  async findUnique(id: string): Promise<University | null> {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        courses: {
          include: { name: true },
        },
        name: true,
        Degree: {
          include: { name: true },
        },
      },
    });

    if (!university) {
      return null;
    }

    return university;
  }
}
