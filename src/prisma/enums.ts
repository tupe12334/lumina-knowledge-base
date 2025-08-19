import type { $Enums } from '@prisma/client';

// GraphQL/runtime enums matching Prisma schema enums
export const QuestionType = {
  selection: 'selection',
  value: 'value',
  void: 'void',
} as const satisfies Record<$Enums.QuestionType, $Enums.QuestionType>;

export type QuestionType = $Enums.QuestionType;

export const QuestionValidationStatus = {
  ai_generated: 'ai_generated',
  in_manual_review: 'in_manual_review',
  approved: 'approved',
  rejected: 'rejected',
} as const satisfies Record<
  $Enums.QuestionValidationStatus,
  $Enums.QuestionValidationStatus
>;

export type QuestionValidationStatus = $Enums.QuestionValidationStatus;
