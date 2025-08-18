import { Block } from '../../blocks/models/Block.entity';

export class ModuleRelationshipResult {
  id: string;

  prerequisite: Block;

  postrequisite: Block;

  metadata: Record<string, string>;
}
