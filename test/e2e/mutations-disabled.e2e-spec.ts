import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TestResolver } from './test-graphql-schema';
import { env } from 'src/env';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Mutations E2E (Disabled)', () => {
  let app: INestApplication;
  let testMutation: string;

  beforeAll(async () => {
    env.ENABLE_MUTATIONS = false;
    testMutation = `
      mutation TestMutation($input: TestInput!) {
        testMutation(input: $input)
      }
    `;
    const { MutationsGuard } = await import('src/guards/mutations.guard');
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
          useClass: MutationsGuard,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    env.ENABLE_MUTATIONS = true; // Reset for other tests
    await app?.close();
  });

  it('should block mutations when ENABLE_MUTATIONS is false', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpAdapter().getInstance())
      .post('/graphql')
      .send({
        query: testMutation,
        variables: {
          input: {
            test: 'test',
          },
        },
      })
      .expect(200)
      .then(
        (res: {
          body: { errors: { message: string; extensions: { code: string } }[] };
        }) => {
          expect(res.body.errors).toBeDefined();
          expect(res.body.errors[0].message).toBe(
            'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
          );
          expect(res.body.errors[0].extensions.code).toBe('FORBIDDEN');
        },
      );
  });
});
