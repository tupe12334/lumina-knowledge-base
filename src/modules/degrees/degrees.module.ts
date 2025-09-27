import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DegreesController } from './degrees.controller';
import { DegreesSummaryService } from './services/degrees-summary.service';
import { DegreesRelationshipService } from './services/degrees-relationship.service';
import { DegreesQueryService } from './services/degrees-query.service';
import { DegreesCrudService } from './services/degrees-crud.service';

@Module({
  imports: [PrismaModule],
  providers: [
    DegreesService,
    DegreesSummaryService,
    DegreesRelationshipService,
    DegreesQueryService,
    DegreesCrudService,
  ],
  exports: [DegreesService],
  controllers: [DegreesController],
})
export class DegreesModule {}
