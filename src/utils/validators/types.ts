export interface ValidationResult {
  tableName: string;
  invalidCount: number;
  fixedCount: number;
  errors: string[];
}