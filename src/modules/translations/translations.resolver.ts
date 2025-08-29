import { Resolver } from '@nestjs/graphql';
import { TranslationsService } from './translations.service';
import { Translation } from './models/Translation.entity';

@Resolver(() => Translation)
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}
}
