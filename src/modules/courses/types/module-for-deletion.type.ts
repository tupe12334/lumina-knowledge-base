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