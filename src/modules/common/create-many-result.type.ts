import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateManyResult {
  @Field(() => Int, { description: 'The number of records created' })
  count: number;
}
