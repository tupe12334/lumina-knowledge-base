import { InputType, Field } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';

@InputType()
export class DegreesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by name' })
  @Field(() => String, { nullable: true })
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by faculty id' })
  @Field(() => String, { nullable: true })
  facultyId?: string;

  @ApiPropertyOptional({ description: 'Filter by institution id' })
  @Field(() => String, { nullable: true })
  universityId?: string;
}
