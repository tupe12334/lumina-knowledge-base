import { Module } from '@nestjs/common';
import { DatabaseController } from 'src/system/database/database.controller';
import { DatabaseService } from 'src/system/database/database.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DatabaseController],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
