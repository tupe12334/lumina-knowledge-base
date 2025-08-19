import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlocksService } from './blocks.service';
import { BlocksResolver } from './blocks.resolver';
import { BlocksController } from './blocks.controller';

@Module({
  imports: [PrismaModule],
  providers: [BlocksService, BlocksResolver],
  controllers: [BlocksController],
})
export class BlocksModule {}
