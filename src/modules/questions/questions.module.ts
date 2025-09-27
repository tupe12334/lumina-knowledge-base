import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsQueryService } from './services/questions-query.service';
import { QuestionsCrudService } from './services/questions-crud.service';
import { QuestionsSummaryService } from './services/questions-summary.service';

@Module({
  imports: [PrismaModule],
  providers: [
    QuestionsService,
    QuestionsQueryService,
    QuestionsCrudService,
    QuestionsSummaryService,
  ],
  exports: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
