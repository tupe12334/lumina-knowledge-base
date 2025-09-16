import { describe, it, beforeAll, afterAll } from 'vitest';
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
import { MutationsGuardModule, EnvConfigFactory } from 'nestjs-mutations-guard';

@Controller('test')
export class TestController {
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

describe('REST Mutations Enabled (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Ensure mutations are enabled for this test
    env.BLOCK_MUTATIONS = false;

    const moduleFixture = await Test.createTestingModule({
      imports: [MutationsGuardModule.register({ configFactory: new EnvConfigFactory() })],
      controllers: [TestController],
      providers: [Reflector],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should allow GET requests when mutations are enabled', () => {
    return request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect({ message: 'GET allowed' });
  });

  it('should allow POST requests when mutations are enabled', () => {
    return request(app.getHttpServer())
      .post('/test')
      .send({ name: 'Test Data' })
      .expect(201)
      .expect({ message: 'POST allowed', data: { name: 'Test Data' } });
  });

  it('should allow PUT requests when mutations are enabled', () => {
    return request(app.getHttpServer())
      .put('/test/123')
      .send({ name: 'Updated Data' })
      .expect(200)
      .expect({ message: 'PUT allowed', data: { name: 'Updated Data' } });
  });

  it('should allow DELETE requests when mutations are enabled', () => {
    return request(app.getHttpServer())
      .delete('/test/123')
      .expect(200)
      .expect({ message: 'DELETE allowed' });
  });
});
