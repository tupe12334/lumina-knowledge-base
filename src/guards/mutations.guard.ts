import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo, OperationTypeNode } from 'graphql';
import { env } from '../env';

/**
 * Global guard that checks if mutations are enabled via environment variable.
 * Only blocks GraphQL mutations - queries are always allowed.
 * Mutations are disabled by default and require ENABLE_MUTATIONS=true to be set.
 */
@Injectable()
export class MutationsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Get GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    const info: GraphQLResolveInfo = gqlContext.getInfo();
    
    // Only check mutations, allow queries and subscriptions
    if (info?.operation?.operation !== OperationTypeNode.MUTATION) {
      return true;
    }

    if (!env.ENABLE_MUTATIONS) {
      throw new ForbiddenException(
        'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
      );
    }
    
    return true;
  }
}
