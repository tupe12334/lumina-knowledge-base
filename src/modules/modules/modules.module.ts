import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';

@Module({
  imports: [PrismaModule],
  providers: [ModulesService],
  controllers: [ModulesController],
})
export class ModulesModule {}
