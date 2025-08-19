import { Module } from '@nestjs/common';
import { DataHashService } from 'src/system/data-hash/data-hash.service';

@Module({
  providers: [DataHashService],
  exports: [DataHashService],
})
export class DataHashModule {}
