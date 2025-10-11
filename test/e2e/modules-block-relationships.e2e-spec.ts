import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Modules Block Relationships API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('GET /modules/:id - Block Relationships in SubModules', () => {
    it('should include Block relationships in subModules', async () => {
      // Find a module that has subModules with Block relationships
      const moduleWithSubModules = await prisma.module.findFirst({
        where: {
          subModules: {
            some: {
              Block: {
                OR: [
                  { prerequisiteFor: { some: {} } },
                  { postrequisiteOf: { some: {} } },
                ],
              },
            },
          },
        },
        include: {
          subModules: {
            include: {
              Block: {
                include: {
                  prerequisiteFor: true,
                  postrequisiteOf: true,
                },
              },
            },
          },
        },
      });

      if (!moduleWithSubModules) {
        // Skip test if no suitable test data exists
        console.log('Skipping test: No module with subModules having Block relationships found');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/modules/${moduleWithSubModules.id}`)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.subModules).toBeDefined();
      expect(Array.isArray(response.body.subModules)).toBe(true);

      // Verify at least one subModule has Block relationships
      const subModulesWithBlock = response.body.subModules.filter(
        (subModule: { Block?: object }) => subModule.Block
      );

      expect(subModulesWithBlock.length).toBeGreaterThan(0);

      // Verify the Block has prerequisiteFor or postrequisiteOf
      const subModulesWithRelationships = subModulesWithBlock.filter(
        (subModule: {
          Block: {
            prerequisiteFor?: unknown[];
            postrequisiteOf?: unknown[];
          }
        }) =>
          (subModule.Block.prerequisiteFor && subModule.Block.prerequisiteFor.length > 0) ||
          (subModule.Block.postrequisiteOf && subModule.Block.postrequisiteOf.length > 0)
      );

      expect(subModulesWithRelationships.length).toBeGreaterThan(0);
    });

    it('should include nested Module information in Block relationships', async () => {
      // Find a module with Block relationships
      const moduleWithRelationships = await prisma.module.findFirst({
        where: {
          subModules: {
            some: {
              Block: {
                prerequisiteFor: {
                  some: {},
                },
              },
            },
          },
        },
      });

      if (!moduleWithRelationships) {
        console.log('Skipping test: No module with prerequisite relationships found');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/modules/${moduleWithRelationships.id}`)
        .expect(200);

      expect(response.body.subModules).toBeDefined();

      // Find a subModule with prerequisiteFor relationships
      const subModuleWithPrereq = response.body.subModules.find(
        (subModule: {
          Block?: {
            prerequisiteFor?: Array<{
              postrequisite?: {
                Module?: Array<{ name?: object }>
              }
            }>
          }
        }) =>
          subModule.Block &&
          subModule.Block.prerequisiteFor &&
          subModule.Block.prerequisiteFor.length > 0
      );

      if (subModuleWithPrereq) {
        const prereqRelationship = subModuleWithPrereq.Block.prerequisiteFor[0];
        expect(prereqRelationship).toHaveProperty('postrequisite');
        expect(prereqRelationship.postrequisite).toHaveProperty('Module');
        expect(Array.isArray(prereqRelationship.postrequisite.Module)).toBe(true);

        if (prereqRelationship.postrequisite.Module.length > 0) {
          expect(prereqRelationship.postrequisite.Module[0]).toHaveProperty('name');
        }
      }
    });

    it('should include metadata in Block relationships', async () => {
      const moduleWithMetadata = await prisma.module.findFirst({
        where: {
          subModules: {
            some: {
              Block: {
                prerequisiteFor: {
                  some: {
                    metadata: {
                      some: {},
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!moduleWithMetadata) {
        console.log('Skipping test: No module with relationship metadata found');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/modules/${moduleWithMetadata.id}`)
        .expect(200);

      const subModuleWithMetadata = response.body.subModules.find(
        (subModule: {
          Block?: {
            prerequisiteFor?: Array<{
              metadata?: unknown[]
            }>
          }
        }) =>
          subModule.Block &&
          subModule.Block.prerequisiteFor &&
          subModule.Block.prerequisiteFor.some(
            (rel: { metadata?: unknown[] }) => rel.metadata && rel.metadata.length > 0
          )
      );

      if (subModuleWithMetadata) {
        const relationshipWithMetadata = subModuleWithMetadata.Block.prerequisiteFor.find(
          (rel: { metadata?: unknown[] }) => rel.metadata && rel.metadata.length > 0
        );

        expect(relationshipWithMetadata).toHaveProperty('metadata');
        expect(Array.isArray(relationshipWithMetadata.metadata)).toBe(true);
      }
    });
  });

  describe('GET /modules?courseId=:id - Block Relationships Not Included', () => {
    it('should NOT include Block relationships when fetching course modules', async () => {
      // Find a course with modules
      const course = await prisma.course.findFirst({
        where: {
          modules: {
            some: {},
          },
        },
      });

      if (!course) {
        console.log('Skipping test: No course with modules found');
        return;
      }

      const response = await request(app.getHttpServer())
        .get(`/modules?courseId=${course.id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        // Course modules should not include Block relationships
        const firstModule = response.body[0];
        expect(firstModule).not.toHaveProperty('Block');
        expect(firstModule).not.toHaveProperty('subModules');
      }
    });
  });
});
