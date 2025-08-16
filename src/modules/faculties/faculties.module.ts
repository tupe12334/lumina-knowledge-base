import { Module } from '@nestjs/common';
import { FacultiesService } from './faculties.service';
import { FacultiesResolver } from './faculties.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DegreesModule } from '../degrees/degrees.module';

@Module({
  imports: [PrismaModule, DegreesModule],
  providers: [FacultiesService, FacultiesResolver],
})
export class FacultiesModule {}
