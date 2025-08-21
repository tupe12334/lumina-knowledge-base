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
  ApiResponse,
  ApiParam,
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
  @ApiOperation({
    summary: 'Create a new block',
    description: 'Creates a new block record.',
  })
  @ApiCreatedResponse({ type: Block, description: 'The newly created block.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  create(@Body() createBlockDto: CreateBlockInput) {
    return this.blocksService.create(createBlockDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Create multiple blocks',
    description: 'Creates multiple block records in a single operation.',
  })
  @ApiCreatedResponse({
    description: 'The number of blocks created.',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          description: 'Number of blocks created',
          example: 5,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createMany(@Body() createManyBlocksDto: CreateManyBlocksInput) {
    return this.blocksService.createMany(createManyBlocksDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all blocks',
    description: 'Returns a list of all blocks.',
  })
  @ApiOkResponse({
    type: Block,
    isArray: true,
    description: 'A list of blocks.',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findAll() {
    return this.blocksService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a block by ID',
    description: 'Returns a single block by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the block', type: String })
  @ApiOkResponse({
    type: Block,
    description: 'The block with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Block not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  findOne(@Param('id') id: string) {
    return this.blocksService.findUnique(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a block by ID',
    description: 'Updates an existing block record.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the block', type: String })
  @ApiOkResponse({ type: Block, description: 'The updated block.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Block not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockInput) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a block by ID',
    description: 'Deletes a block record by its ID.',
  })
  @ApiParam({ name: 'id', description: 'The ID of the block', type: String })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Block successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Block not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  remove(@Param('id') id: string) {
    return this.blocksService.delete(id);
  }

  @Post('relationship')
  @ApiOperation({
    summary: 'Create a block relationship',
    description: 'Creates a new relationship between blocks.',
  })
  @ApiCreatedResponse({
    type: BlockRelationshipResult,
    description: 'The newly created block relationship.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  createRelationship(
    @Body() createBlockRelationshipDto: CreateBlockRelationshipInput,
  ) {
    return this.blocksService.createBlockRelationship(
      createBlockRelationshipDto,
    );
  }

  @Delete('relationship')
  @ApiOperation({
    summary: 'Delete a block relationship',
    description: 'Deletes an existing relationship between blocks.',
  })
  @ApiNoContentResponse({
    description: 'Block relationship successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Block relationship not found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  deleteRelationship(
    @Body() deleteBlockRelationshipDto: DeleteBlockRelationshipInput,
  ) {
    return this.blocksService.deleteBlockRelationship(
      deleteBlockRelationshipDto,
    );
  }
}
