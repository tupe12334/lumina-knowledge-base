import { Module } from '@nestjs/common';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';
import { FacultiesResolver } from './faculties.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FacultiesController],
  providers: [FacultiesService, FacultiesResolver],
})
export class FacultiesModule {}
