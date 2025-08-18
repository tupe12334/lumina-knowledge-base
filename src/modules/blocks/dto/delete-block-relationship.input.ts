import { InputType, Field, ID } from '@nestjs/graphql';
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
}
