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
import { BlocksService } from './blocks.service';
import { CreateBlockInput } from './dto/create-block.input';
import { UpdateBlockInput } from './dto/update-block.input';
import { CreateBlockRelationshipInput } from './dto/create-block-relationship.input';
import { DeleteBlockRelationshipInput } from './dto/delete-block-relationship.input';

@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  create(@Body() createBlockDto: CreateBlockInput) {
    return this.blocksService.create(createBlockDto);
  }

  @Get()
  findAll() {
    return this.blocksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blocksService.findUnique(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBlockDto: UpdateBlockInput) {
    return this.blocksService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.blocksService.delete(id);
  }

  @Post('relationship')
  createRelationship(
    @Body() createBlockRelationshipDto: CreateBlockRelationshipInput,
  ) {
    return this.blocksService.createBlockRelationship(
      createBlockRelationshipDto,
    );
  }

  @Delete('relationship')
  deleteRelationship(
    @Body() deleteBlockRelationshipDto: DeleteBlockRelationshipInput,
  ) {
    return this.blocksService.deleteBlockRelationship(
      deleteBlockRelationshipDto,
    );
  }
}
