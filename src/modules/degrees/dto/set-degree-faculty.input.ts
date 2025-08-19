import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Input for setting or clearing a degree's faculty.
 */
@InputType()
export class SetDegreeFacultyInput {
  @ApiProperty({ description: 'Degree ID' })
  @Field(() => ID, { description: 'Degree ID' })
  @IsUUID()
  degreeId!: string;

  @ApiPropertyOptional({ description: 'Faculty ID to assign; null to clear' })
  @Field(() => ID, {
    nullable: true,
    description:
      'Faculty ID to assign. If null, clears the faculty assignment.',
  })
  @IsOptional()
  @IsUUID()
  facultyId?: string | null;
}
