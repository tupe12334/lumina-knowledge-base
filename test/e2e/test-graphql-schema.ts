import {
  Field,
  InputType,
  Mutation,
  Query,
  Args,
  Resolver,
} from '@nestjs/graphql';

@InputType()
export class TestInput {
  @Field()
  test: string;
}

@Resolver()
export class TestResolver {
  @Query(() => String)
  testQuery() {
    return 'Hello';
  }

  @Mutation(() => String)
  testMutation(@Args('input', { type: () => TestInput }) input: TestInput) {
    return input.test;
  }
}
