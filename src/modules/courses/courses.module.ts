import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { ModulesModule } from '../modules/modules.module';
import { CoursesController } from './courses.controller';

@Module({
  imports: [PrismaModule, ModulesModule],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}
