import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Translation {
  @Field()
  id!: string;

  @Field()
  en_text!: string;

  @Field()
  he_text!: string;
}
