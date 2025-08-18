import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TestInput, TestResolver } from './test-graphql-schema';
import { env } from 'src/env';

describe('Mutations E2E (Enabled)', () => {
  let app: INestApplication;
  let testMutation: string;

  beforeAll(async () => {
    env.ENABLE_MUTATIONS = true;
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
    env.ENABLE_MUTATIONS = false; // Reset for other tests
    await app?.close();
  });

  it('should allow mutations when ENABLE_MUTATIONS is true', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: testMutation,
        variables: {
          input: {
            test: 'Test University'
          },
        },
      })
      .expect(200)
      .then((res) => {
        expect(res.body.errors).toBeUndefined();
        expect(res.body.data.testMutation).toBe(
          'Test University',
        );
      });
  });
});
