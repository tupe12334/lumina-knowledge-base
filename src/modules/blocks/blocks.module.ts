import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BlocksService } from './blocks.service';
import { BlocksController } from './blocks.controller';

@Module({
  imports: [PrismaModule],
  providers: [BlocksService],
  controllers: [BlocksController],
})
export class BlocksModule {}
