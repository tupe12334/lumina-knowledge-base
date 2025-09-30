export interface ModuleWithQuestions {
  Questions: Array<{
    id: string;
    Answer: Array<{ id: string }>;
  }>;
}