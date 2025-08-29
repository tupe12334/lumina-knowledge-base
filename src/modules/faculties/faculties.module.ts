import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DegreesModule } from '../degrees/degrees.module';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';

@Module({
  imports: [PrismaModule, DegreesModule],
  providers: [FacultiesService],
  controllers: [FacultiesController],
})
export class FacultiesModule {}
