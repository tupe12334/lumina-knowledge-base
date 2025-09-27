import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Degree } from '../models/Degree.entity';
import { CreateDegreeInput } from '../dto/create-degree.input';
import { CreateManyDegreesInput } from '../dto/create-many-degrees.input';
import { UpdateDegreeInput } from '../dto/update-degree.input';

/**
 * Service for basic CRUD operations on degrees.
 * Handles create, update, and delete operations for degrees.
 */
@Injectable()
export class DegreesCrudService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDegreeInput: CreateDegreeInput): Promise<Degree> {
    const { name, universityId } = createDegreeInput;
    return this.prisma.degree.create({
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
      },
      include: {
        name: true,
      },
    });
  }

  /**
   * Creates multiple degrees in a single transaction.
   * @param input - The data for creating multiple degrees
   * @returns The number of degrees created
   */
  async createMany(input: CreateManyDegreesInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const degreeData of input.degrees) {
        const { name, universityId } = degreeData;
        await prisma.degree.create({
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
          },
        });
        createdCount++;
      }

      return { count: createdCount };
    });
  }

  async update(
    id: string,
    updateDegreeInput: UpdateDegreeInput,
  ): Promise<Degree> {
    const { universityId, name } = updateDegreeInput;
    return this.prisma.degree.update({
      where: { id },
      data: {
        ...(universityId
          ? { institution: { connect: { id: universityId } } }
          : {}),
        ...(name ? { name: { update: { en_text: name, he_text: name } } } : {}),
      },
      include: {
        name: true,
      },
    });
  }

  async delete(id: string): Promise<Degree> {
    return this.prisma.degree.delete({
      where: { id },
      include: {
        name: true,
        institution: { include: { name: true } },
        faculty: { include: { name: true, description: true } },
        courses: { include: { name: true } },
      },
    });
  }
}