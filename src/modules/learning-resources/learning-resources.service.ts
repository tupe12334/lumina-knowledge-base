import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LearningResource } from './models/LearningResource.entity';

@Injectable()
export class LearningResourcesService {
  constructor(private readonly prisma: PrismaService) {}

  async findByModuleId(moduleId: string): Promise<LearningResource[]> {
    return this.prisma.learningResource.findMany({
      where: { moduleId },
      orderBy: { relevance: 'desc' },
    });
  }

  async findUnique(id: string): Promise<LearningResource | null> {
    return this.prisma.learningResource.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<LearningResource[]> {
    return this.prisma.learningResource.findMany({
      orderBy: { relevance: 'desc' },
    });
  }
}
