import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModulesService } from './modules.service';
import { ModulesResolver } from './modules.resolver';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [PrismaModule, QuestionsModule],
  providers: [ModulesService, ModulesResolver],
  exports: [ModulesService],
})
export class ModulesModule {}
