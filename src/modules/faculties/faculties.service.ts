import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFacultyInput } from './dto/create-faculty.input';
import { UpdateFacultyInput } from './dto/update-faculty.input';

@Injectable()
export class FacultiesService {
  constructor(private prisma: PrismaService) {}

  async create(createFacultyInput: CreateFacultyInput) {
    const { name, description, universityId } = createFacultyInput;
    return this.prisma.faculty.create({
      data: {
        university: {
          connect: {
            id: universityId,
          },
        },
        name: {
          create: {
            en_text: name,
          },
        },
        description: {
          create: {
            en_text: description,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.faculty.findMany({
      include: {
        name: true,
        description: true,
      },
    });
  }

  async getFacultiesByUniversity(universityId: string) {
    return this.prisma.faculty.findMany({
      where: {
        universityId,
      },
      include: {
        name: true,
        description: true,
      },
    });
  }

  async getFacultyById(id: string) {
    return this.prisma.faculty.findUnique({
      where: { id },
      include: {
        name: true,
        description: true,
      },
    });
  }

  async update(id: string, updateFacultyInput: UpdateFacultyInput) {
    return this.prisma.faculty.update({
      where: { id },
      data: updateFacultyInput,
    });
  }

  async delete(id: string) {
    return this.prisma.faculty.delete({ where: { id } });
  }
}
