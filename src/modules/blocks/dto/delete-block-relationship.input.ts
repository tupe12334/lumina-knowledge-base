import { InputType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Input type for deleting a prerequisite/postrequisite relationship between blocks.
 */
@InputType()
export class DeleteBlockRelationshipInput {
  /**
   * The ID of the prerequisite block.
   */
  @Field(() => ID, {
    description: 'The ID of the prerequisite block',
  })
  @ApiProperty({
    description: 'The ID of the prerequisite block',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsString()
  prerequisiteBlockId: string;

  /**
   * The ID of the postrequisite block.
   */
  @Field(() => ID, {
    description: 'The ID of the postrequisite block',
  })
  @ApiProperty({
    description: 'The ID of the postrequisite block',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsNotEmpty()
  @IsString()
  postrequisiteBlockId: string;
}
