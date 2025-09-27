import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BlocksRelationshipValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  async validateBlocksExist(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    const [prerequisiteBlock, postrequisiteBlock] = await Promise.all([
      this.prisma.block.findUnique({ where: { id: prerequisiteBlockId } }),
      this.prisma.block.findUnique({ where: { id: postrequisiteBlockId } }),
    ]);

    if (!prerequisiteBlock) {
      throw new NotFoundException(`Prerequisite block with ID ${prerequisiteBlockId} not found`);
    }

    if (!postrequisiteBlock) {
      throw new NotFoundException(`Postrequisite block with ID ${postrequisiteBlockId} not found`);
    }
  }

  async checkExistingRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    const existingRelationship = await this.prisma.blockRelationship.findUnique({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });

    if (existingRelationship) {
      throw new BadRequestException('Relationship already exists between these blocks');
    }
  }

  validateSelfRelationship(prerequisiteBlockId: string, postrequisiteBlockId: string) {
    if (prerequisiteBlockId === postrequisiteBlockId) {
      throw new BadRequestException('A block cannot be a prerequisite to itself');
    }
  }
}