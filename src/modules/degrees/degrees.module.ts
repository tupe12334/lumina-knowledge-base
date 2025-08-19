import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DegreesResolver } from './degrees.resolver';
import { DegreesController } from './degrees.controller';

@Module({
  imports: [PrismaModule],
  providers: [DegreesService, DegreesResolver],
  exports: [DegreesService],
  controllers: [DegreesController],
})
export class DegreesModule {}
