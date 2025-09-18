/**
 * Field-specific error for detailed error reporting
 */
export class FieldError extends Error {
  public readonly field: string;
  public readonly value?: unknown;
  public readonly code?: string;

  public constructor(field: string, message: string, value?: unknown, code?: string) {
    super(message);
    this.name = 'FieldError';
    this.field = field;
    this.value = value;
    this.code = code;
  }

  /**
   * Create a required field error
   */
  public static required(field: string): FieldError {
    return new FieldError(field, `Field "${field}" is required`, undefined, 'REQUIRED');
  }

  /**
   * Create a type mismatch error
   */
  public static typeMismatch(field: string, expected: string, actual: unknown): FieldError {
    return new FieldError(
      field,
      `Field "${field}": Expected ${expected}, got ${typeof actual}`,
      actual,
      'TYPE_MISMATCH',
    );
  }
}
