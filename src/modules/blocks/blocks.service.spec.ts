import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrismock } from 'prismock';
import * as client from '../../../generated/client';
import { BlocksService } from './blocks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';
import { BadRequestException, NotFoundException } from '@nestjs/common';

vi.mock('@prisma/client', async () => {
  const actual = (await vi.importActual(
    '@prisma/client',
  )) as unknown as typeof client;

  return {
    ...actual,
    PrismaClient: createPrismock(actual.Prisma) as typeof client.PrismaClient,
  };
});

let prisma: PrismaService;
let service: BlocksService;

beforeEach(() => {
  prisma = new PrismaService();
  service = new BlocksService(prisma);
});

describe('BlocksService', () => {
  it('returns block from prisma', async () => {
    const moduleName = await prisma.translation.create({
      data: { en_text: 'Module', he_text: 'מודול' },
    });

    const block = await prisma.block.create({ data: { id: 'b1' } });
    await prisma.block.create({ data: { id: 'b2' } });
    await prisma.block.update({
      where: { id: 'b1' },
      data: { postrequisiteOf: { connect: { id: 'b2' } } },
    });

    await prisma.module.create({
      data: { id: 'm1', translationId: moduleName.id, blockId: block.id },
    });

    const result = await service.findUnique('b1');

    expect(result).toBeDefined();
    expect(result?.id).toBe('b1');
    // Module is the actual property name from Prisma (capital M)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module?.[0]?.id).toBe('m1');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module?.[0]?.name?.en_text).toBe('Module');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect((result as any)?.Module?.[0]?.name?.he_text).toBe('מודול');
    expect(result?.prerequisiteFor).toEqual([]);
    expect(result?.postrequisiteOf).toEqual([]);
  });

  describe('createBlockRelationship', () => {
    it('should create a relationship between two blocks', async () => {
      // Create two blocks for testing
      await prisma.block.create({ data: { id: 'block-1' } });
      await prisma.block.create({ data: { id: 'block-2' } });

      const input: CreateBlockRelationshipInput = {
        prerequisiteBlockId: 'block-1',
        postrequisiteBlockId: 'block-2',
        metadata: { type: 'hard' },
      };

      const result = await service.createBlockRelationship(input);

      expect(result).toBeDefined();
      expect(result.prerequisite.id).toBe('block-1');
      expect(result.postrequisite.id).toBe('block-2');
      expect(result.metadata).toContain('hard');
    });

    it('should throw BadRequestException if same block is used for both prerequisite and postrequisite', async () => {
      const input: CreateBlockRelationshipInput = {
        prerequisiteBlockId: 'block-1',
        postrequisiteBlockId: 'block-1',
      };

      await expect(service.createBlockRelationship(input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if prerequisite block does not exist', async () => {
      await prisma.block.create({ data: { id: 'block-2' } });

      const input: CreateBlockRelationshipInput = {
        prerequisiteBlockId: 'non-existent',
        postrequisiteBlockId: 'block-2',
      };

      await expect(service.createBlockRelationship(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if relationship already exists', async () => {
      await prisma.block.create({ data: { id: 'block-3' } });
      await prisma.block.create({ data: { id: 'block-4' } });

      // Create the relationship first time
      const input: CreateBlockRelationshipInput = {
        prerequisiteBlockId: 'block-3',
        postrequisiteBlockId: 'block-4',
      };

      await service.createBlockRelationship(input);

      // Try to create the same relationship again
      await expect(service.createBlockRelationship(input)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteBlockRelationship', () => {
    it('should delete a relationship between two blocks', async () => {
      // Create two blocks and a relationship
      await prisma.block.create({ data: { id: 'block-5' } });
      await prisma.block.create({ data: { id: 'block-6' } });

      const createInput: CreateBlockRelationshipInput = {
        prerequisiteBlockId: 'block-5',
        postrequisiteBlockId: 'block-6',
        metadata: { type: 'hard' },
      };

      const created = await service.createBlockRelationship(createInput);

      const deleteInput: DeleteBlockRelationshipInput = {
        prerequisiteBlockId: 'block-5',
        postrequisiteBlockId: 'block-6',
      };

      const result = await service.deleteBlockRelationship(deleteInput);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.prerequisite.id).toBe('block-5');
      expect(result.postrequisite.id).toBe('block-6');
    });

    it('should throw NotFoundException if prerequisite block does not exist', async () => {
      await prisma.block.create({ data: { id: 'block-7' } });

      const input: DeleteBlockRelationshipInput = {
        prerequisiteBlockId: 'non-existent',
        postrequisiteBlockId: 'block-7',
      };

      await expect(service.deleteBlockRelationship(input)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if relationship does not exist', async () => {
      await prisma.block.create({ data: { id: 'block-8' } });
      await prisma.block.create({ data: { id: 'block-9' } });

      const input: DeleteBlockRelationshipInput = {
        prerequisiteBlockId: 'block-8',
        postrequisiteBlockId: 'block-9',
      };

      await expect(service.deleteBlockRelationship(input)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
