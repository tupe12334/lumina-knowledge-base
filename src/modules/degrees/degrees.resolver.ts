import { Resolver, Query, Args } from '@nestjs/graphql';
import { DegreesService } from './degrees.service';
import { Degree } from './models/Degree.entity';
import { DegreesQueryDto } from './dto/degrees-query.dto';

@Resolver(() => Degree)
export class DegreesResolver {
  constructor(private readonly degreesService: DegreesService) {}

  @Query(() => [Degree])
  async degrees(@Args('query', { type: () => DegreesQueryDto, nullable: true }) query?: DegreesQueryDto) {
    return this.degreesService.findAll(query);
  }
}
