export enum RelationshipMetadataKey {
  REASON = 'REASON',
  TYPE = 'TYPE',
  DESCRIPTION = 'DESCRIPTION',
}

export enum QuestionType {
  selection = 'selection',
  value = 'value',
  void = 'void',
}

export enum QuestionValidationStatus {
  ai_generated = 'ai_generated',
  in_manual_review = 'in_manual_review',
  approved = 'approved',
  rejected = 'rejected',
}

export enum Units {
  meter = 'meter',
  kilogram = 'kilogram',
  second = 'second',
  ampere = 'ampere',
  kelvin = 'kelvin',
  mole = 'mole',
  candela = 'candela',
}

export enum LearningResourceType {
  video = 'video',
}

export const Prisma = {
  RelationshipMetadataKey,
  QuestionType,
  QuestionValidationStatus,
  Units,
  LearningResourceType,
};

export class PrismaClient {
  async $connect(): Promise<void> {
    return Promise.resolve();
  }
  async $disconnect(): Promise<void> {
    return Promise.resolve();
  }
}
