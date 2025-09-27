import { Module } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsQueryService } from './services/institutions-query.service';
import { InstitutionsCrudService } from './services/institutions-crud.service';
import { InstitutionsSummaryService } from './services/institutions-summary.service';

@Module({
  imports: [PrismaModule],
  providers: [
    InstitutionsService,
    InstitutionsQueryService,
    InstitutionsCrudService,
    InstitutionsSummaryService,
  ],
  controllers: [InstitutionsController],
})
export class InstitutionsModule {}
