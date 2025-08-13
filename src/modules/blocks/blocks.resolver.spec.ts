import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlocksResolver } from './blocks.resolver';
import { BlocksService } from './blocks.service';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';

describe('BlocksResolver', () => {
  let resolver: BlocksResolver;
  let mockBlocksService: {
    findUnique: ReturnType<typeof vi.fn>;
    createBlockRelationship: ReturnType<typeof vi.fn>;
    deleteBlockRelationship: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockBlocksService = {
      findUnique: vi.fn(),
      createBlockRelationship: vi.fn(),
      deleteBlockRelationship: vi.fn(),
    };

    resolver = new BlocksResolver(
      mockBlocksService as unknown as BlocksService,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getBlock', () => {
    it('should return a block', async () => {
      const mockBlock = { id: '1', prerequisiteFor: [], postrequisiteOf: [] };
      mockBlocksService.findUnique.mockResolvedValue(mockBlock);

      const result = await resolver.getBlock('1');

      expect(result).toEqual(mockBlock);
      expect(mockBlocksService.findUnique).toHaveBeenCalledWith('1');
    });
  });

  describe('createBlockRelationship', () => {
    it('should create a block relationship', async () => {
      const input: CreateBlockRelationshipInput = {
        prerequisiteBlockId: 'block-1',
        postrequisiteBlockId: 'block-2',
      };

      const mockResult = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: '{}',
      };

      mockBlocksService.createBlockRelationship.mockResolvedValue(mockResult);

      const result = await resolver.createBlockRelationship(input);

      expect(result).toBe(mockResult);
      expect(mockBlocksService.createBlockRelationship).toHaveBeenCalledWith(
        input,
      );
    });
  });

  describe('deleteBlockRelationship', () => {
    it('should delete a block relationship', async () => {
      const input: DeleteBlockRelationshipInput = {
        prerequisiteBlockId: 'block-1',
        postrequisiteBlockId: 'block-2',
      };

      const mockResult = {
        id: 'relationship-1',
        prerequisite: { id: 'block-1' },
        postrequisite: { id: 'block-2' },
        metadata: '{}',
      };

      mockBlocksService.deleteBlockRelationship.mockResolvedValue(mockResult);

      const result = await resolver.deleteBlockRelationship(input);

      expect(result).toBe(mockResult);
      expect(mockBlocksService.deleteBlockRelationship).toHaveBeenCalledWith(
        input,
      );
    });
  });
});
