import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Module as ModuleEntity } from '../models/Module.entity';
import { CreateModuleInput } from '../dto/create-module.input';
import { CreateManyModulesInput } from '../dto/create-many-modules.input';
import { UpdateModuleInput } from '../dto/update-module.input';

@Injectable()
export class ModulesCrudService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new module with its associated translation and block.
   * @param input - The data for creating the module
   * @returns The newly created module
   */
  async create(input: CreateModuleInput): Promise<ModuleEntity> {
    const { en_text, he_text, courseId } = input;

    // Validate that the course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Create a new translation for the module name
    const translation = await this.prisma.translation.create({
      data: {
        en_text,
        he_text,
      },
    });

    // Create a new block for the module
    const block = await this.prisma.block.create({
      data: {},
    });

    // Create the module, linking it to the translation, block, and course
    const module = await this.prisma.module.create({
      data: {
        translationId: translation.id,
        blockId: block.id,
        Course: {
          connect: { id: courseId },
        },
      },
      include: {
        name: true,
        Block: true,
      },
    });

    return module satisfies ModuleEntity;
  }

  async update(id: string, updateModuleInput: UpdateModuleInput) {
    return this.prisma.module.update({
      where: { id },
      data: updateModuleInput,
    });
  }

  async delete(id: string) {
    return this.prisma.module.delete({ where: { id } });
  }

  /**
   * Creates multiple modules in a single transaction.
   * @param input - The data for creating multiple modules
   * @returns The number of modules created
   */
  async createMany(input: CreateManyModulesInput) {
    return this.prisma.$transaction(async (prisma) => {
      let createdCount = 0;

      for (const moduleData of input.modules) {
        const { en_text, he_text, courseId } = moduleData;

        // Validate that the course exists
        const course = await prisma.course.findUnique({
          where: { id: courseId },
        });

        if (!course) {
          throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        // Create a new translation for the module name
        const translation = await prisma.translation.create({
          data: {
            en_text,
            he_text,
          },
        });

        // Create a new block for the module
        const block = await prisma.block.create({
          data: {},
        });

        // Create the module, linking it to the translation, block, and course
        await prisma.module.create({
          data: {
            translationId: translation.id,
            blockId: block.id,
            Course: {
              connect: { id: courseId },
            },
          },
        });

        createdCount++;
      }

      return { count: createdCount };
    });
  }
}