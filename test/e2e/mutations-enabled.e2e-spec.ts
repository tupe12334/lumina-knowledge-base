import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CanActivate } from '@nestjs/common';
import { TestResolver } from './test-graphql-schema';
// Mock env to force ENABLE_MUTATIONS=true for this test file
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
      canActivate(): boolean {
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

    return request(app.getHttpAdapter().getInstance())
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
      .then(
        (res: {
          body: { errors?: unknown; data: { testMutation: string } };
        }) => {
          expect(res.body.errors).toBeUndefined();
          expect(res.body.data.testMutation).toBe('Test University');
        },
      );
  });
});
