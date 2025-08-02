import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, Min } from 'class-validator';

@InputType()
export class ModulesQueryInput {
  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by minimum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minQuestions?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by maximum number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxQuestions?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'Filter modules by exact number of questions',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  exactQuestions?: number;
}
