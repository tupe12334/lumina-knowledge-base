import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { RelationshipMetadataKey } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { Block } from './models/Block.entity';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';
import { BlockRelationshipResult } from './dto/block-relationship-result.type';
import { CreateBlockInput } from './dto/create-block.input';
import { UpdateBlockInput } from './dto/update-block.input';

/**
 * Service handling block retrieval and relationship logic.
 */
@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBlockInput: CreateBlockInput): Promise<Block> {
    return this.prisma.block.create({ data: createBlockInput });
  }

  async findAll(): Promise<Block[]> {
    return this.prisma.block.findMany();
  }

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

  async update(id: string, updateBlockInput: UpdateBlockInput): Promise<Block> {
    return this.prisma.block.update({
      where: { id },
      data: updateBlockInput,
    });
  }

  async delete(id: string): Promise<Block> {
    return this.prisma.block.delete({ where: { id } });
  }

  /**
   * Creates a prerequisite/postrequisite relationship between two blocks.
   * @param relationshipData - The relationship data containing block IDs and optional metadata
   * @returns The created relationship with full details
   */
  async createBlockRelationship(
    relationshipData: CreateBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    const { prerequisiteBlockId, postrequisiteBlockId, metadata } =
      relationshipData;

    if (prerequisiteBlockId === postrequisiteBlockId) {
      throw new BadRequestException(
        'A block cannot be a prerequisite to itself',
      );
    }

    // Validate that both blocks exist
    const [prerequisiteBlock, postrequisiteBlock] = await Promise.all([
      this.prisma.block.findUnique({
        where: { id: prerequisiteBlockId },
      }),
      this.prisma.block.findUnique({
        where: { id: postrequisiteBlockId },
      }),
    ]);

    if (!prerequisiteBlock) {
      throw new NotFoundException(
        `Prerequisite block with ID ${prerequisiteBlockId} not found`,
      );
    }

    if (!postrequisiteBlock) {
      throw new NotFoundException(
        `Postrequisite block with ID ${postrequisiteBlockId} not found`,
      );
    }

    // Check if relationship already exists
    const existingRelationship = await this.prisma.blockRelationship.findUnique(
      {
        where: {
          prerequisiteId_postrequisiteId: {
            prerequisiteId: prerequisiteBlockId,
            postrequisiteId: postrequisiteBlockId,
          },
        },
      },
    );

    if (existingRelationship) {
      throw new BadRequestException(
        'Relationship already exists between these blocks',
      );
    }

    // Create the relationship
    const relationship = await this.prisma.blockRelationship.create({
      data: {
        prerequisiteId: prerequisiteBlockId,
        postrequisiteId: postrequisiteBlockId,
        metadata: metadata
          ? {
              create: Object.entries(metadata).map(([key, value]) => ({
                key: key as RelationshipMetadataKey,
                value: String(value),
              })),
            }
          : undefined,
      },
      include: {
        prerequisite: true,
        postrequisite: true,
        metadata: true,
      },
    });

    // Format metadata for response
    const formattedMetadata =
      relationship.metadata?.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }

  /**
   * Deletes a prerequisite/postrequisite relationship between two blocks.
   * @param relationshipData - The relationship data containing block IDs
   * @returns The deleted relationship with full details
   */
  async deleteBlockRelationship(
    relationshipData: DeleteBlockRelationshipInput,
  ): Promise<BlockRelationshipResult> {
    const { prerequisiteBlockId, postrequisiteBlockId } = relationshipData;

    // Validate that both blocks exist
    const [prerequisiteBlock, postrequisiteBlock] = await Promise.all([
      this.prisma.block.findUnique({
        where: { id: prerequisiteBlockId },
      }),
      this.prisma.block.findUnique({
        where: { id: postrequisiteBlockId },
      }),
    ]);

    if (!prerequisiteBlock) {
      throw new NotFoundException(
        `Prerequisite block with ID ${prerequisiteBlockId} not found`,
      );
    }

    if (!postrequisiteBlock) {
      throw new NotFoundException(
        `Postrequisite block with ID ${postrequisiteBlockId} not found`,
      );
    }

    // Find the relationship to delete
    const existingRelationship = await this.prisma.blockRelationship.findUnique(
      {
        where: {
          prerequisiteId_postrequisiteId: {
            prerequisiteId: prerequisiteBlockId,
            postrequisiteId: postrequisiteBlockId,
          },
        },
        include: {
          prerequisite: true,
          postrequisite: true,
          metadata: true,
        },
      },
    );

    if (!existingRelationship) {
      throw new NotFoundException(
        'Relationship not found between these blocks',
      );
    }

    // Format metadata for response before deletion
    const formattedMetadata =
      existingRelationship.metadata?.reduce(
        (acc, meta) => {
          acc[meta.key] = meta.value;
          return acc;
        },
        {} as Record<string, string>,
      ) || {};

    // Delete the relationship
    await this.prisma.blockRelationship.delete({
      where: {
        prerequisiteId_postrequisiteId: {
          prerequisiteId: prerequisiteBlockId,
          postrequisiteId: postrequisiteBlockId,
        },
      },
    });

    return {
      id: existingRelationship.id,
      prerequisite: existingRelationship.prerequisite,
      postrequisite: existingRelationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}
