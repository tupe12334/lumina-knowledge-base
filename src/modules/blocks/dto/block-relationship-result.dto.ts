import { Block } from '../models/Block.entity';

export class BlockRelationshipResult {
  id: string;

  prerequisite: Block;

  postrequisite: Block;

  metadata: Record<string, string>;
}
