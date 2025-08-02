import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesResolver } from './courses.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesResolver],
})
export class CoursesModule {}
