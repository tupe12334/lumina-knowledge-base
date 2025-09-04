import type { $Enums } from '@prisma/client';

// Runtime enums matching Prisma schema enums

export const QuestionTypeValues = {
  selection: 'selection',
  value: 'value',
  boolean: 'boolean',
  void: 'void',
} as const satisfies Record<$Enums.QuestionType, $Enums.QuestionType>;
