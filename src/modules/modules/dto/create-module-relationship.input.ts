import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * GraphQL input type for creating prerequisite/postrequisite relationships between modules.
 * Used in GraphQL mutations to specify the relationship data.
 */
@InputType()
export class CreateModuleRelationshipInput {
  /**
   * The ID of the prerequisite module.
   * This module must be completed before the postrequisite module.
   */
  @ApiProperty({ description: 'The ID of the prerequisite module' })
  @Field(() => ID, {
    description: 'The ID of the prerequisite module',
  })
  @IsUUID()
  prerequisiteModuleId: string;

  /**
   * The ID of the postrequisite module.
   * This module requires the prerequisite module to be completed first.
   */
  @ApiProperty({ description: 'The ID of the postrequisite module' })
  @Field(() => ID, {
    description: 'The ID of the postrequisite module',
  })
  @IsUUID()
  postrequisiteModuleId: string;

  /**
   * Optional metadata for the relationship.
   * Can contain additional information about the relationship such as
   * minimum grade required, completion percentage, etc.
   */
  @ApiPropertyOptional({
    description: 'Optional metadata for the relationship (JSON string)',
  })
  @Field(() => String, {
    nullable: true,
    description: 'Optional metadata for the relationship (JSON string)',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
