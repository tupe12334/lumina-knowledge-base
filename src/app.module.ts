import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { serverEnvSchema } from './env/schema';
import { BlocksModule } from './modules/blocks/blocks.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DatabaseModule } from './system/database/database.module';
import { DegreesModule } from './modules/degrees/degrees.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { HealthModule } from './system/health/health.module';
import { ModulesModule } from './modules/modules/modules.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { InstitutionsModule } from './modules/institutions/institutions.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { PrismaModule } from './prisma/prisma.module';
import { MutationsGuard } from './guards/mutations.guard';
import { AnswersModule } from './modules/answers/answers.module';
import { DataHashModule } from 'src/system/data-hash/data-hash.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => serverEnvSchema.parse(config),
    }),
    PrismaModule,
    HealthModule,
    DatabaseModule,
    InstitutionsModule,
    CoursesModule,
    DegreesModule,
    QuestionsModule,
    ModulesModule,
    BlocksModule,
    FacultiesModule,
    TranslationsModule,
    AnswersModule,
    DataHashModule,
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
