import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TranslationsService } from './translations.service';
import { Translation } from './models/Translation.entity';
import { CreateTranslationInput } from './dto/create-translation.input';
import { CreateManyTranslationsInput } from './dto/create-many-translations.input';
import { UpdateTranslationInput } from './dto/update-translation.input';
import { CreateManyResult } from '../common/create-many-result.type';

@Resolver(() => Translation)
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Mutation(() => Translation, { name: 'createTranslation' })
  createTranslation(
    @Args('createTranslationInput')
    createTranslationInput: CreateTranslationInput,
  ) {
    return this.translationsService.create(createTranslationInput);
  }

  @Mutation(() => CreateManyResult, {
    name: 'createManyTranslations',
    description: 'Create multiple translations in bulk',
  })
  createManyTranslations(
    @Args('input') input: CreateManyTranslationsInput,
  ): Promise<CreateManyResult> {
    return this.translationsService.createMany(input);
  }

  @Query(() => [Translation], { name: 'translations' })
  findAll() {
    return this.translationsService.findAll();
  }

  @Query(() => Translation, { name: 'translation', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.translationsService.findOne(id);
  }

  @Mutation(() => Translation, { name: 'updateTranslation' })
  updateTranslation(
    @Args('updateTranslationInput')
    updateTranslationInput: UpdateTranslationInput,
  ) {
    return this.translationsService.update(
      updateTranslationInput.id,
      updateTranslationInput,
    );
  }

  @Mutation(() => Translation, { name: 'removeTranslation' })
  removeTranslation(@Args('id', { type: () => ID }) id: string) {
    return this.translationsService.remove(id);
  }
}
