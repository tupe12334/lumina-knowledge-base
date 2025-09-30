import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { CreateManyFacultiesInput } from './dto/create-many-faculties.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';

@Injectable()
export class FacultiesService {
  constructor(private prisma: PrismaService) {}

  private getFacultyInclude() {
    return {
      name: true,
      description: true,
    };
  }

  private createFacultyData(name: string, description: string, universityId: string) {
    return {
      institution: { connect: { id: universityId } },
      name: { create: { en_text: name, he_text: name } },
      description: { create: { en_text: description, he_text: description } },
    };
  }

  async create(createFacultyInput: CreateFacultyInput) {
    const { name, description, universityId } = createFacultyInput;
    return this.prisma.faculty.create({
      data: this.createFacultyData(name, description, universityId),
      include: this.getFacultyInclude(),
    });
  }

  /**
   * Creates multiple faculties in a single transaction.
   * @param input - The data for creating multiple faculties
   * @returns The number of faculties created
   */
  async createMany(input: CreateManyFacultiesInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const facultyData of input.faculties) {
        const { name, description, universityId } = facultyData;
        await prisma.faculty.create({
          data: this.createFacultyData(name, description, universityId),
        });
        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async findAll() {
    return this.prisma.faculty.findMany({
      include: this.getFacultyInclude(),
    });
  }

  async getFacultiesByInstitution(institutionId: string) {
    return this.prisma.faculty.findMany({
      where: { institutionId },
      include: this.getFacultyInclude(),
    });
  }

  async getFacultyById(id: string) {
    return this.prisma.faculty.findUnique({
      where: { id },
      include: this.getFacultyInclude(),
    });
  }

  async update(id: string, updateFacultyInput: UpdateFacultyInput) {
    const { name, description, universityId } = updateFacultyInput;
    return this.prisma.faculty.update({
      where: { id },
      data: {
        ...(universityId
          ? { institution: { connect: { id: universityId } } }
          : {}),
        ...(name ? { name: { update: { en_text: name, he_text: name } } } : {}),
        ...(description
          ? {
              description: {
                update: { en_text: description, he_text: description },
              },
            }
          : {}),
      },
      include: this.getFacultyInclude(),
    });
  }

  async delete(id: string) {
    return this.prisma.faculty.delete({ where: { id } });
  }
}
