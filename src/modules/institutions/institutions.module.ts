import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { InstitutionsController } from './institutions.controller';

@Module({
  imports: [PrismaModule],
  providers: [InstitutionsService],
  controllers: [InstitutionsController],
})
export class InstitutionsModule {}
