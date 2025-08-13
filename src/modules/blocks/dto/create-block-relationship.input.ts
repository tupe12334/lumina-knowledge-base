import { InputType, Field, ID } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * Input type for creating a prerequisite/postrequisite relationship between blocks.
 */
@InputType()
export class CreateBlockRelationshipInput {
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

  /**
   * Optional metadata for the relationship.
   */
  @Field(() => String, {
    nullable: true,
    description: 'Optional metadata for the relationship (JSON string)',
  })
  @ApiProperty({
    description: 'Optional metadata for the relationship',
    type: 'object',
    required: false,
    example: {
      reason: 'Foundation concepts required',
      type: 'hard',
      description: 'Students must complete this before proceeding',
    },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
