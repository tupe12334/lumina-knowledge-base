import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { UniversitiesResolver } from './universities.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UniversitiesController],
  providers: [UniversitiesService, UniversitiesResolver],
})
export class UniversitiesModule {}
