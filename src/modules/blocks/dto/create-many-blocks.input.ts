import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBlockInput } from './create-block.input';

export class CreateManyBlocksInput {
  @ApiProperty({
    description: 'Array of block data to create',
    type: [CreateBlockInput],
    example: [
      { name: 'Introduction', moduleId: 'uuid1' },
      { name: 'Advanced Topics', moduleId: 'uuid2' },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one block must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateBlockInput)
  blocks!: CreateBlockInput[];
}
