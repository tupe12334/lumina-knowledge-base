import { Prisma } from '@prisma/client';

// Transaction type for course deletion operations
export type CourseDeletionTransaction = Prisma.TransactionClient;

// Module with block for deletion operations
export interface ModuleWithBlock {
  id: string;
  Block: { id: string };
  translationId: string;
}


// Module for comprehensive deletion operations
export interface ModuleForDeletion {
  id: string;
  Block: { id: string };
  translationId: string;
  Course: Array<{ id: string }>;
  Questions: Array<{
    id: string;
    Answer: Array<{ id: string }>;
  }>;
}

// Course with modules for deletion operations
export interface CourseWithModules {
  id: string;
  Block: {
    id: string;
    prerequisiteFor: Array<unknown>;
    postrequisiteOf: Array<unknown>;
  };
  translationId: string;
  modules: Array<ModuleForDeletion>;
}

// Question with answers for deletion operations
export interface QuestionWithAnswers {
  id: string;
  Answer: Array<{ id: string }>;
}

// Module with questions for deletion operations
export interface ModuleWithQuestions {
  Questions: Array<{
    id: string;
    Answer: Array<{ id: string }>;
  }>;
}