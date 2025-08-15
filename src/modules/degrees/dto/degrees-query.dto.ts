import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DegreesQueryDto {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  facultyId?: string;

  @Field(() => String, { nullable: true })
  universityId?: string;
}
