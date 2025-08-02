import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';
import { BlocksResolver } from './blocks.resolver';

@Module({
  imports: [PrismaModule],
  providers: [BlocksService, BlocksResolver],
  controllers: [BlocksController],
})
export class BlocksModule {}
