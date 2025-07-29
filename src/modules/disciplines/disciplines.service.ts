import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Discipline } from './models/Discipline.entity';

@Injectable()
export class DisciplinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Discipline[]> {
    const disciplines = await this.prisma.discipline.findMany({
      include: { name: true, courses: { include: { name: true } } },
    });

    return disciplines;
  }

  async findUnique(id: string): Promise<Discipline | null> {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
      include: { name: true, courses: { include: { name: true } } },
    });

    if (!discipline) {
      return null;
    }

    return discipline;
  }
}
