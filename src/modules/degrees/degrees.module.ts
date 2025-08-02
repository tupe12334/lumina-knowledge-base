import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { DegreesController } from './degrees.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { DegreesResolver } from './degrees.resolver';

@Module({
  imports: [PrismaModule],
  controllers: [DegreesController],
  providers: [DegreesService, DegreesResolver],
  exports: [DegreesService],
})
export class DegreesModule {}
