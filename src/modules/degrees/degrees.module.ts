import { Module } from '@nestjs/common';
import { DegreesService } from './degrees.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { DegreesResolver } from './degrees.resolver';

@Module({
  imports: [PrismaModule],
  providers: [DegreesService, DegreesResolver],
  exports: [DegreesService],
})
export class DegreesModule {}
