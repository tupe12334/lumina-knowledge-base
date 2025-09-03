import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DegreesController } from './degrees.controller';

@Module({
  imports: [PrismaModule],
  providers: [DegreesService],
  exports: [DegreesService],
  controllers: [DegreesController],
})
export class DegreesModule {}
