import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';

@Module({
  imports: [PrismaModule],
  providers: [CoursesService, CoursesResolver],
})
export class CoursesModule {}
