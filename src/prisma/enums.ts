import type { $Enums } from '@prisma/client';

// GraphQL/runtime enums matching Prisma schema enums
export const QuestionTypeValues = {
  selection: 'selection',
  value: 'value',
  boolean: 'boolean',
  void: 'void',
} as const satisfies Record<$Enums.QuestionType, $Enums.QuestionType>;

export type QuestionType = $Enums.QuestionType;

export const QuestionValidationStatusValues = {
  ai_generated: 'ai_generated',
  in_manual_review: 'in_manual_review',
  approved: 'approved',
  rejected: 'rejected',
} as const satisfies Record<
  $Enums.QuestionValidationStatus,
  $Enums.QuestionValidationStatus
>;

export type QuestionValidationStatus = $Enums.QuestionValidationStatus;

export const UnitsValues = {
  meter: 'meter',
  kilogram: 'kilogram',
  second: 'second',
  ampere: 'ampere',
  kelvin: 'kelvin',
  mole: 'mole',
  candela: 'candela',
} as const satisfies Record<$Enums.Units, $Enums.Units>;

export type Units = $Enums.Units;
