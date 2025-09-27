import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { BlocksQueryService } from './services/blocks-query.service';
import { BlocksRelationshipService } from './services/blocks-relationship.service';

@Module({
  imports: [PrismaModule],
  providers: [
    BlocksService,
    BlocksQueryService,
    BlocksRelationshipService,
  ],
  controllers: [BlocksController],
})
export class BlocksModule {}
