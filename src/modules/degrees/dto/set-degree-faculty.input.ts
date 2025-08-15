import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsOptional } from 'class-validator';

/**
 * Input for setting or clearing a degree's faculty.
 */
@InputType()
export class SetDegreeFacultyInput {
  @Field(() => ID, { description: 'Degree ID' })
  @IsUUID()
  degreeId!: string;

  @Field(() => ID, {
    nullable: true,
    description:
      'Faculty ID to assign. If null, clears the faculty assignment.',
  })
  @IsOptional()
  @IsUUID()
  facultyId?: string | null;
}
