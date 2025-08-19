import { Module } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { TranslationsResolver } from './translations.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { TranslationsController } from './translations.controller';

@Module({
  imports: [PrismaModule],
  providers: [TranslationsResolver, TranslationsService],
  exports: [TranslationsService],
  controllers: [TranslationsController],
})
export class TranslationsModule {}
