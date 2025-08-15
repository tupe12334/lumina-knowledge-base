import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlocksService } from './blocks.service';
import { BlocksResolver } from './blocks.resolver';

@Module({
  imports: [PrismaModule],
  providers: [BlocksService, BlocksResolver],
})
export class BlocksModule {}
