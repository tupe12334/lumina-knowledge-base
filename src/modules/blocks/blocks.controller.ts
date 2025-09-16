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
  ApiOperation,
} from '@nestjs/swagger';
import { BlocksService } from './blocks.service';
import { CreateBlockInput } from './dto/create-block.input';
import { CreateManyBlocksInput } from './dto/create-many-blocks.input';
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
  @ApiOperation({ summary: 'Create a new block' })
  @ApiCreatedResponse({ type: Block })
  create(@Body() createBlockDto: CreateBlockInput) {
    return this.blocksService.create(createBlockDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple blocks' })
  @ApiCreatedResponse({ description: 'Number of blocks created' })
  createMany(@Body() createManyBlocksDto: CreateManyBlocksInput) {
    return this.blocksService.createMany(createManyBlocksDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all blocks' })
  @ApiOkResponse({ type: Block, isArray: true })
  findAll() {
    return this.blocksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a block by ID' })
  @ApiOkResponse({ type: Block })
  findOne(@Param('id') id: string) {
    return this.blocksService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a block by ID' })
  @ApiOkResponse({ type: Block })
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockInput) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a block by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.blocksService.delete(id);
  }

  @Post('relationship')
  @ApiOperation({ summary: 'Create a block relationship' })
  @ApiCreatedResponse({ type: BlockRelationshipResult })
  createRelationship(
    @Body() createBlockRelationshipDto: CreateBlockRelationshipInput,
  ) {
    return this.blocksService.createBlockRelationship(
      createBlockRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiOperation({ summary: 'Delete a block relationship' })
  @ApiNoContentResponse()
  deleteRelationship(
    @Body() deleteBlockRelationshipDto: DeleteBlockRelationshipInput,
  ) {
    return this.blocksService.deleteBlockRelationship(
      deleteBlockRelationshipDto,
    );
  }
}
