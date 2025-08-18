import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Translation } from '../../translations/models/Translation.entity';
import { Degree } from '../../degrees/models/Degree.entity';

@ObjectType()
export class Faculty {
  @Field(() => ID)
  id!: string;

  @Field(() => Translation)
  name!: Translation;

  @Field(() => Translation)
  description: Translation;

  @Field(() => [Degree], { nullable: 'itemsAndList' })
  degrees?: Degree[];
}
