import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsController } from './questions.controller';

@Module({
  imports: [PrismaModule],
  providers: [QuestionsService, QuestionsResolver],
  exports: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
