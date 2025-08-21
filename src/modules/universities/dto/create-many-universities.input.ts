import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUniversityInput } from './create-university.input';

@InputType()
export class CreateManyUniversitiesInput {
  @ApiProperty({
    description: 'Array of university data to create',
    type: [CreateUniversityInput],
    example: [
      { en_text: 'Harvard University', he_text: 'אוניברסיטת הרווארד' },
      { en_text: 'MIT', he_text: 'מכון הטכנולוגי של מסצ׳וסטס' },
    ],
  })
  @Field(() => [CreateUniversityInput], {
    description: 'Array of university data to create',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one university must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateUniversityInput)
  universities!: CreateUniversityInput[];
}
