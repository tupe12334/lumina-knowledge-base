import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';

@Module({
  imports: [PrismaModule],
  providers: [QuestionsService, QuestionsResolver],
})
export class QuestionsModule {}
