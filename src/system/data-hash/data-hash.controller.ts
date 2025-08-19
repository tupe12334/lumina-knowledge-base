import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataHashService } from 'src/system/data-hash/data-hash.service';

interface DbHashResponse {
  hash: string;
}

@ApiTags('system')
@Controller('system')
export class DataHashController {
  constructor(
    @Inject(DataHashService) private readonly dataHash: DataHashService,
  ) {}

  @Get('db-hash')
  @ApiOperation({
    summary: 'Get database data hash',
    description:
      'Returns a deterministic SHA-256 hash representing the current database contents.',
  })
  @ApiOkResponse({ description: 'Database data hash' })
  getDbHash(): DbHashResponse {
    const hash = this.dataHash.getHash();
    if (!hash) {
      throw new ServiceUnavailableException('Database hash not available yet');
    }
    return { hash };
  }
}
