import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateModuleInput } from './create-module.input';

@InputType()
export class CreateManyModulesInput {
  @ApiProperty({
    description: 'Array of module data to create',
    type: [CreateModuleInput],
    example: [
      {
        en_text: 'Linear Algebra',
        he_text: 'אלגברה לינארית',
        courseId: 'uuid1',
      },
      {
        en_text: 'Calculus',
        he_text: 'חשבון אינפיניטסימלי',
        courseId: 'uuid2',
      },
    ],
  })
  @Field(() => [CreateModuleInput], {
    description: 'Array of module data to create',
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one module must be provided' })
  @ValidateNested({ each: true })
  @Type(() => CreateModuleInput)
  modules!: CreateModuleInput[];
}
