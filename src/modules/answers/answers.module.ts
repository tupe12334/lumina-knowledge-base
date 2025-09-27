import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AnswersQueryService } from './services/answers-query.service';
import { AnswersCrudService } from './services/answers-crud.service';
import { AnswersUpdateService } from './services/answers-update.service';

@Module({
  imports: [PrismaModule],
  controllers: [AnswersController],
  providers: [
    AnswersService,
    AnswersQueryService,
    AnswersCrudService,
    AnswersUpdateService,
  ],
  exports: [AnswersService],
})
export class AnswersModule {}
