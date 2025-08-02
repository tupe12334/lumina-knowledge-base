import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class DegreesQueryDto {
  @Field(() => String, { nullable: true })
  name?: string;
}
