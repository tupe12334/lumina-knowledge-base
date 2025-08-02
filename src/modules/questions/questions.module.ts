import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsResolver } from './questions.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsResolver],
})
export class QuestionsModule {}
