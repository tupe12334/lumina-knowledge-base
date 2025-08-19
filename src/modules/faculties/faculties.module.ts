import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesResolver } from './faculties.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DegreesModule } from '../degrees/degrees.module';
import { FacultiesController } from './faculties.controller';

@Module({
  imports: [PrismaModule, DegreesModule],
  providers: [FacultiesService, FacultiesResolver],
  controllers: [FacultiesController],
})
export class FacultiesModule {}
