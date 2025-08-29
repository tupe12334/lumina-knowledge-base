import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlocksResolver } from './blocks.resolver';
import { BlocksService } from './blocks.service';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';

describe('BlocksResolver', () => {
  let resolver: BlocksResolver;
  let mockBlocksService: {
    deleteBlockRelationship: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockBlocksService = {
      deleteBlockRelationship: vi.fn(),
    };

    resolver = new BlocksResolver(
      mockBlocksService as unknown as BlocksService,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
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
