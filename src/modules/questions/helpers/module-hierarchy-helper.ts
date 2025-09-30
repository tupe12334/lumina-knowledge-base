import { PrismaService } from '../../../prisma/prisma.service';

export class ModuleHierarchyHelper {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSubmoduleIds(moduleId: string): Promise<string[]> {
    const visited = new Set<string>();
    const result: string[] = [];

    await this.collectSubmodules(moduleId, visited, result);
    return result;
  }

  private async collectSubmodules(moduleId: string, visited: Set<string>, result: string[]) {
    if (visited.has(moduleId)) {
      return;
    }

    visited.add(moduleId);
    result.push(moduleId);

    const submodules = await this.prisma.module.findMany({
      where: {
        parentModules: {
          some: {
            id: moduleId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    for (const submodule of submodules) {
      await this.collectSubmodules(submodule.id, visited, result);
    }
  }

  async getModulesWithFewestQuestions(limit?: number): Promise<Array<{ id: string; questionCount: number }>> {
    const queryLimit = limit || 5;
    const modules = await this.prisma.module.findMany({
      include: {
        _count: {
          select: {
            Questions: true,
          },
        },
      },
      orderBy: {
        Questions: {
          _count: 'asc',
        },
      },
      take: queryLimit,
    });

    return modules.map(module => ({
      id: module.id,
      questionCount: module._count.Questions,
    }));
  }
}