import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { ModulesResolver } from './modules.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ModulesService, ModulesResolver],
  controllers: [ModulesController],
})
export class ModulesModule {}
