import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { CreateBlockInput } from './dto/create-block.input';
import { UpdateBlockInput } from './dto/update-block.input';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';
import { Block } from './models/Block.entity';
import { BlockRelationshipResult } from './dto/block-relationship-result.dto';

@ApiTags('blocks')
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  @ApiCreatedResponse({ type: Block })
  create(@Body() createBlockDto: CreateBlockInput) {
    return this.blocksService.create(createBlockDto);
  }

  @Get()
  @ApiOkResponse({ type: Block, isArray: true })
  findAll() {
    return this.blocksService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: Block })
  findOne(@Param('id') id: string) {
    return this.blocksService.findUnique(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: Block })
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockInput) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.blocksService.delete(id);
  }

  @Post('relationship')
  @ApiCreatedResponse({ type: BlockRelationshipResult })
  createRelationship(
    @Body() createBlockRelationshipDto: CreateBlockRelationshipInput,
  ) {
    return this.blocksService.createBlockRelationship(
      createBlockRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiNoContentResponse()
  deleteRelationship(
    @Body() deleteBlockRelationshipDto: DeleteBlockRelationshipInput,
  ) {
    return this.blocksService.deleteBlockRelationship(
      deleteBlockRelationshipDto,
    );
  }
}
