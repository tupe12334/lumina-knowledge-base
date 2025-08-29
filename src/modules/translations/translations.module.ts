import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';

@Module({
  imports: [PrismaModule],
  providers: [TranslationsService],
  exports: [TranslationsService],
  controllers: [TranslationsController],
})
export class TranslationsModule {}
