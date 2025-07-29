import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Module as ModuleEntity } from './models/Module.entity';

@Injectable()
export class ModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async findUnique(id: string): Promise<ModuleEntity | null> {
    return this.prisma.module.findUnique({
      where: { id },
      include: {
        name: true,
        Block: {
          include: {
            prerequisiteFor: true,
            postrequisiteOf: true,
          },
        },
        subModules: {
          include: {
            name: true,
            subModules: { include: { name: true } },
          },
        },
        parentModules: { include: { name: true } },
        LearningResource: {
          orderBy: { relevance: 'desc' },
        },
      },
    });
  }

  async findAll(): Promise<ModuleEntity[]> {
    return this.prisma.module.findMany({
      include: {
        name: true,
        Block: {
          include: {
            prerequisiteFor: true,
            postrequisiteOf: true,
          },
        },
        subModules: {
          include: {
            name: true,
            subModules: { include: { name: true } },
          },
        },
        parentModules: { include: { name: true } },
        LearningResource: {
          orderBy: { relevance: 'desc' },
        },
      },
    });
  }
}
