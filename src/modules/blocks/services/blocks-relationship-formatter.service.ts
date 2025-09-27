import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BlockRelationshipResult } from '../dto/block-relationship-result.type';
import { formatRelationshipMetadata } from '../helpers/relationship-metadata.helper';

type RelationshipWithIncludes = Prisma.BlockRelationshipGetPayload<{
  include: { prerequisite: true; postrequisite: true; metadata: true };
}>;

@Injectable()
export class BlocksRelationshipFormatterService {
  formatRelationshipResult(relationship: RelationshipWithIncludes): BlockRelationshipResult {
    const formattedMetadata = formatRelationshipMetadata(relationship.metadata);

    return {
      id: relationship.id,
      prerequisite: relationship.prerequisite,
      postrequisite: relationship.postrequisite,
      metadata: JSON.stringify(formattedMetadata),
    };
  }
}