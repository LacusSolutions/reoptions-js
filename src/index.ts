export { FieldProcessor } from './core/FieldProcessor';
// Main exports
export { OptionsSchema } from './core/OptionsSchema';

export { CustomTestError } from './errors/CustomTestError';
export { FieldError } from './errors/FieldError';

// Error exports
export { ValidationError } from './errors/ValidationError';

// Processor exports
export { IntFieldProcessor } from './processors/IntFieldProcessor';
// Type exports
export type {
  ArrayFieldDefinition,
  BooleanFieldDefinition,
  FieldDefinition,
  FloatFieldDefinition,
  IntFieldDefinition,
  ObjectFieldDefinition,
  SchemaDefinition,
  StringFieldDefinition,
  UnionFieldDefinition,
} from './types/FieldDefinition';
export type { FieldType } from './types/FieldType';

// Result exports
export { ValidationResult } from './types/ValidationResult';
