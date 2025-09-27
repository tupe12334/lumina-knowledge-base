import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { BlocksQueryService } from './services/blocks-query.service';
import { BlocksRelationshipService } from './services/blocks-relationship.service';
import { BlocksRelationshipValidatorService } from './services/blocks-relationship-validator.service';
import { BlocksRelationshipQueryService } from './services/blocks-relationship-query.service';
import { BlocksRelationshipFormatterService } from './services/blocks-relationship-formatter.service';

@Module({
  imports: [PrismaModule],
  providers: [
    BlocksService,
    BlocksQueryService,
    BlocksRelationshipService,
    BlocksRelationshipValidatorService,
    BlocksRelationshipQueryService,
    BlocksRelationshipFormatterService,
  ],
  controllers: [BlocksController],
})
export class BlocksModule {}
