import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Block } from './models/Block.entity';

/**
 * Service handling block retrieval logic.
 */
@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a block by its id.
   *
   * @param id - Block identifier
   * @returns The block if found otherwise null
   */
  async findUnique(id: string): Promise<Block | null> {
    return this.prisma.block.findUnique({
      where: { id },
      include: {
        Module: { include: { name: true } },
        prerequisiteFor: {
          include: {
            prerequisite: { include: { Module: { include: { name: true } } } },
            metadata: true,
          },
        },
        postrequisiteOf: {
          include: {
            postrequisite: { include: { Module: { include: { name: true } } } },
            metadata: true,
          },
        },
      },
    });
  }
}
