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
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
import { env } from '../../src/env';

@Controller('test')
class TestController {
  @Get()
  get() {
    return { message: 'GET allowed' };
  }

  @Post()
  post(@Body() body: any) {
    return { message: 'POST allowed', data: body };
  }

  @Put(':id')
  put(@Body() body: any) {
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
    env.ENABLE_MUTATIONS = false;

    const { MutationsGuard } = await import('../../src/guards/mutations.guard');

    const moduleFixture = await Test.createTestingModule({
      controllers: [TestController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: MutationsGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    env.ENABLE_MUTATIONS = true; // Reset for other tests
    await app?.close();
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
          'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
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
          'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
        );
      });
  });

  it('should block DELETE requests when mutations are disabled', () => {
    return request(app.getHttpServer())
      .delete('/test/123')
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toBe(
          'Mutations are disabled. Set ENABLE_MUTATIONS=true in environment variables to enable them.',
        );
      });
  });
});
