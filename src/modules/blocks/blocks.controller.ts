import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { Block } from './models/Block.entity';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get(':id')
  @ApiOkResponse({ type: Block })
  async getBlock(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Block | null> {
    return this.blocksService.findUnique(id);
  }
}
