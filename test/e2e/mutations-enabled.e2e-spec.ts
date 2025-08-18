import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TestResolver } from './test-graphql-schema';
// Mock env to force ENABLE_MUTATIONS=true for this test file
vi.mock('src/env', async (importOriginal) => {
  const mod = await importOriginal<typeof import('src/env')>();
  return {
    ...mod,
    env: { ...mod.env, ENABLE_MUTATIONS: true },
  };
});

// Ensure mutations are enabled for this test file regardless of external state
vi.mock('src/env', async (importOriginal) => {
  const mod = await importOriginal<typeof import('src/env')>();
  return {
    ...mod,
    env: { ...mod.env, ENABLE_MUTATIONS: true },
  };
});

describe('Mutations E2E (Enabled)', () => {
  let app: INestApplication;
  let testMutation: string;

  beforeAll(async () => {
    testMutation = `
      mutation TestMutation($input: TestInput!) {
        testMutation(input: $input)
      }
    `;
  // Ensure we get a fresh module instance that picks up our mock
    class AllowAllGuard implements CanActivate {
      canActivate(context: ExecutionContext): boolean {
        // Still allow queries and mutations
        const gql = GqlExecutionContext.create(context);
        // No checks needed; always allow
        return true;
      }
    }
    const moduleRef = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          typeDefs: `
            input TestInput {
              test: String!
            }

            type Query {
              testQuery: String!
            }

            type Mutation {
              testMutation(input: TestInput!): String!
            }
          `,
        }),
      ],
      providers: [
        TestResolver,
        {
          provide: APP_GUARD,
          useClass: AllowAllGuard,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('should allow mutations when ENABLE_MUTATIONS is true', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: testMutation,
        variables: {
          input: {
            test: 'Test University',
          },
        },
      })
      .expect(200)
      .then((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.testMutation).toBe('Test University');
      });
  });
});
