import { Module } from '@nestjs/common';
import { DataHashService } from 'src/system/data-hash/data-hash.service';
import { DataHashController } from 'src/system/data-hash/data-hash.controller';

@Module({
  controllers: [DataHashController],
  providers: [DataHashService],
  exports: [DataHashService],
})
export class DataHashModule {}
