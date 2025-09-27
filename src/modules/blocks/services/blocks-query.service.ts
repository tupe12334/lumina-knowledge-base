import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Block } from '../models/Block.entity';
import { CreateBlockInput } from '../dto/create-block.input';
import { CreateManyBlocksInput } from '../dto/create-many-blocks.input';
import { UpdateBlockInput } from '../dto/update-block.input';

@Injectable()
export class BlocksQueryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBlockInput: CreateBlockInput): Promise<Block> {
    return this.prisma.block.create({ data: {} });
  }

  async createMany(input: CreateManyBlocksInput) {
    const blockDataArray = input.blocks.map(() => ({}));

    const result = await this.prisma.block.createMany({
      data: blockDataArray,
    });

    return { count: result.count };
  }

  async findAll(): Promise<Block[]> {
    return this.prisma.block.findMany({
      include: {
        Module: {
          include: {
            name: true,
          },
        },
        prerequisiteFor: {
          include: {
            postrequisite: true,
            metadata: true,
          },
        },
        postrequisiteOf: {
          include: {
            prerequisite: true,
            metadata: true,
          },
        },
      },
    });
  }

  async findUnique(id: string): Promise<Block | null> {
    return this.prisma.block.findUnique({
      where: { id },
      include: {
        Module: {
          include: {
            name: true,
          },
        },
        prerequisiteFor: {
          include: {
            postrequisite: true,
            metadata: true,
          },
        },
        postrequisiteOf: {
          include: {
            prerequisite: true,
            metadata: true,
          },
        },
      },
    });
  }

  async update(id: string, updateBlockInput: UpdateBlockInput): Promise<Block> {
    return this.prisma.block.update({
      where: { id },
      data: updateBlockInput,
    });
  }

  async delete(id: string): Promise<Block> {
    return this.prisma.block.delete({ where: { id } });
  }
}