/**
 * Base validation error class
 */
export class ValidationError extends Error {
  public readonly field?: string;
  public readonly value?: unknown;

  public constructor(message: string, field?: string, value?: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
  }

  /**
   * Create a field-specific validation error
   */
  public static forField(field: string, message: string, value?: unknown): ValidationError {
    return new ValidationError(`Field "${field}": ${message}`, field, value);
  }

  /**
   * Create a type validation error
   */
  public static typeMismatch(field: string, expected: string, actual: unknown): ValidationError {
    return new ValidationError(
      `Field "${field}": Expected ${expected}, got ${typeof actual}`,
      field,
      actual,
    );
  }
}
