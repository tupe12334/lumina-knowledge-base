import { DegreesRelationshipApiDecorators } from './degrees-relationship-api.decorators';
import { DegreesSummaryApiDecorators } from './degrees-summary-api.decorators';

export const DegreesExtendedApiDecorators = {
  ...DegreesRelationshipApiDecorators,
  ...DegreesSummaryApiDecorators,
};