import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesResolver } from './universities.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { UniversitiesController } from './universities.controller';

@Module({
  imports: [PrismaModule],
  providers: [UniversitiesService, UniversitiesResolver],
  controllers: [UniversitiesController],
})
export class UniversitiesModule {}
