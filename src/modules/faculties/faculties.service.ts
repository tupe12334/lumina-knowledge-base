import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FacultiesService {
  constructor(private prisma: PrismaService) {}

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
}
