import { Module } from '@nestjs/common';
import { LearningResourcesService } from './learning-resources.service';
import { LearningResourcesController } from './learning-resources.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LearningResourcesService],
  controllers: [LearningResourcesController],
  exports: [LearningResourcesService],
})
export class LearningResourcesModule {}
