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
 * Blocks both GraphQL mutations and REST mutation endpoints (POST, PUT, DELETE, PATCH).
 * Only GET requests and GraphQL queries are always allowed.
 * Mutations are disabled by default and require ENABLE_MUTATIONS=true to be set.
 */
@Injectable()
export class MutationsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const contextType = context.getType();

    if (contextType === 'graphql') {
      return this.handleGraphQLRequest(context);
    } else if (contextType === 'http') {
      return this.handleHTTPRequest(context);
    }

    // Allow other context types (e.g., microservices, RPC)
    return true;
  }

  private handleGraphQLRequest(context: ExecutionContext): boolean {
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

  private handleHTTPRequest(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const method = request.method?.toLowerCase();

    // Allow GET requests and other safe methods
    if (method === 'get' || method === 'head' || method === 'options') {
      return true;
    }

    // Block mutation methods when mutations are disabled
    if (method === 'post' || method === 'put' || method === 'delete' || method === 'patch') {
      if (!env.ENABLE_MUTATIONS) {
        throw new ForbiddenException(
          'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
        );
      }
    }

    return true;
  }
}
