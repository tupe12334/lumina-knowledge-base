import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Institution } from '../models/Institution.entity';

@Injectable()
export class InstitutionsQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Institution[]> {
    const institutions = await this.prisma.institution.findMany({
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

    return institutions;
  }

  async findUnique(id: string): Promise<Institution | null> {
    const institution = await this.prisma.institution.findUnique({
      where: { id },
      include: {
        courses: {
          include: { name: true },
        },
        name: true,
        Degree: {
          include: { name: true },
        },
        Faculty: {
          include: { name: true },
        },
      },
    });

    return institution;
  }
}