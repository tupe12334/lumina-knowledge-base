import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import {
  INestApplication,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import request from 'supertest';
import { env } from '../../src/env';
import { MutationsGuardModule } from 'nestjs-mutations-guard';

@Controller('test')
class TestController {
  @Get()
  get() {
    return { message: 'GET allowed' };
  }

  @Post()
  post(@Body() body: unknown) {
    return { message: 'POST allowed', data: body };
  }

  @Put(':id')
  put(@Body() body: unknown) {
    return { message: 'PUT allowed', data: body };
  }

  @Delete(':id')
  delete() {
    return { message: 'DELETE allowed' };
  }
}

describe('REST Mutations Disabled (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Ensure mutations are disabled for this test
    env.BLOCK_MUTATIONS = true;

    const moduleFixture = await Test.createTestingModule({
      imports: [MutationsGuardModule.register()],
      controllers: [TestController],
      providers: [Reflector],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    env.BLOCK_MUTATIONS = false; // Reset for other tests
    if (app) {
      await app.close();
    }
  });

  it('should allow GET requests when mutations are disabled', () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect({ message: 'GET allowed' });
  });

  it('should block POST requests when mutations are disabled', () => {
    return request(app.getHttpServer())
      .post('/test')
      .send({ name: 'Test Data' })
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toBe(
          'HTTP POST mutations are currently blocked.',
        );
      });
  });

  it('should block PUT requests when mutations are disabled', () => {
    return request(app.getHttpServer())
      .put('/test/123')
      .send({ name: 'Updated Data' })
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toBe(
          'HTTP PUT mutations are currently blocked.',
        );
      });
  });

  it('should block DELETE requests when mutations are disabled', () => {
    return request(app.getHttpServer())
      .delete('/test/123')
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toBe(
          'HTTP DELETE mutations are currently blocked.',
        );
      });
  });
});
