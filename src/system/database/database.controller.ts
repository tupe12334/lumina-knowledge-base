import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DatabaseService } from 'src/system/database/database.service';

@ApiTags('database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('dump')
  @ApiOperation({
    summary: 'Get database dump',
    description: 'Retrieves a dump of the database in SQL format.',
  })
  @Header('Content-Type', 'application/sql')
  @Header(
    'Content-Disposition',
    'attachment; filename="knowledge-base-dump.sql"',
  )
  @ApiOkResponse({ description: 'Database dump in SQL format' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to create database dump',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getDump(): Promise<string> {
    try {
      const dumpContent = await this.databaseService.createDump();
      return dumpContent;
    } catch (error) {
      throw new HttpException(
        `Failed to create database dump: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('info')
  @ApiOperation({
    summary: 'Get database information',
    description: 'Retrieves information about the database.',
  })
  @ApiOkResponse({ description: 'Database information' })
  @ApiInternalServerErrorResponse({
    description: 'Failed to get database info',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getDatabaseInfo() {
    try {
      return await this.databaseService.getDatabaseInfo();
    } catch (error) {
      throw new HttpException(
        `Failed to get database info: ${(error as Error).message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
