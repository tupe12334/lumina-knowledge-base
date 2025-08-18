import { InputType, Field, ID } from '@nestjs/graphql';
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
  @IsNotEmpty()
  @IsString()
  prerequisiteBlockId: string;

  /**
   * The ID of the postrequisite block.
   */
  @Field(() => ID, {
    description: 'The ID of the postrequisite block',
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
  @IsOptional()
  @IsString()
  metadata?: string;
}
