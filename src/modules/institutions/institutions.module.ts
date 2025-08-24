import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { InstitutionsResolver } from './institutions.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { InstitutionsController } from './institutions.controller';

@Module({
  imports: [PrismaModule],
  providers: [InstitutionsService, InstitutionsResolver],
  controllers: [InstitutionsController],
})
export class InstitutionsModule {}
