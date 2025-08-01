import { Module } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { UniversitiesResolver } from './universities.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [UniversitiesService, UniversitiesResolver],
})
export class UniversitiesModule {}
