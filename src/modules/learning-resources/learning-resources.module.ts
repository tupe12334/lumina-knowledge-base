import { Module } from '@nestjs/common';
import { LearningResourcesService } from './learning-resources.service';
import { LearningResourcesResolver } from './learning-resources.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LearningResourcesService, LearningResourcesResolver],
  exports: [LearningResourcesService],
})
export class LearningResourcesModule {}
