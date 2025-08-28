import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { TranslationsService } from './translations.service';
import { Translation } from './models/Translation.entity';

@Resolver(() => Translation)
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Query(() => [Translation], { name: 'translations' })
  findAll() {
    return this.translationsService.findAll();
  }

  @Query(() => Translation, { name: 'translation', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.translationsService.findOne(id);
  }

}
