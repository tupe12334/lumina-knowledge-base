import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TranslationsService } from './translations.service';
import { Translation } from './models/Translation.entity';
import { CreateTranslationInput } from './dto/create-translation.input';
import { UpdateTranslationInput } from './dto/update-translation.input';

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
