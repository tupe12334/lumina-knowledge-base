import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModulesService } from './modules.service';
import { QuestionsModule } from '../questions/questions.module';
import { ModulesController } from './modules.controller';

@Module({
  imports: [PrismaModule, QuestionsModule],
  providers: [ModulesService],
  exports: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}
