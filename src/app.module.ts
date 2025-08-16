import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { serverEnvSchema } from './env/schema';
import { BlocksModule } from './modules/blocks/blocks.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './system/database/database.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { HealthModule } from './system/health/health.module';
import { LearningResourcesModule } from './modules/learning-resources/learning-resources.module';
import { ModulesModule } from './modules/modules/modules.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { PrismaModule } from './prisma/prisma.module';
import { MutationsGuard } from './guards/mutations.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => serverEnvSchema.parse(config),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      introspection: true,
      sortSchema: true,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    PrismaModule,
    HealthModule,
    DatabaseModule,
    UniversitiesModule,
    CoursesModule,
    DegreesModule,
    QuestionsModule,
    ModulesModule,
    BlocksModule,
    FacultiesModule,
    LearningResourcesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: MutationsGuard,
    },
  ],
})
export class AppModule {}
