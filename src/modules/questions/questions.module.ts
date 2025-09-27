import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { QuestionsQueryService } from './services/questions-query.service';
import { QuestionsCrudService } from './services/questions-crud.service';
import { QuestionsSummaryService } from './services/questions-summary.service';
import { QuestionCreator } from './helpers/question-creator';
import { QuestionEntityCreatorService } from './helpers/question-entity-creator.service';
import { QuestionSelectAnswerCreatorService } from './helpers/question-select-answer-creator.service';
import { QuestionValueAnswerCreatorService } from './helpers/question-value-answer-creator.service';
import { QuestionAnswerCoordinatorService } from './helpers/question-answer-coordinator.service';
import { QuestionQueryBuilder } from './helpers/question-query-builder';
import { QuestionWhereBuilderService } from './helpers/question-where-builder.service';
import { QuestionIncludeBuilderService } from './helpers/question-include-builder.service';
import { QuestionOrderBuilderService } from './helpers/question-order-builder.service';

@Module({
  imports: [PrismaModule],
  providers: [
    QuestionsService,
    QuestionsQueryService,
    QuestionsCrudService,
    QuestionsSummaryService,
    QuestionCreator,
    QuestionEntityCreatorService,
    QuestionSelectAnswerCreatorService,
    QuestionValueAnswerCreatorService,
    QuestionAnswerCoordinatorService,
    QuestionQueryBuilder,
    QuestionWhereBuilderService,
    QuestionIncludeBuilderService,
    QuestionOrderBuilderService,
  ],
  exports: [QuestionsService],
  controllers: [QuestionsController],
})
export class QuestionsModule {}
