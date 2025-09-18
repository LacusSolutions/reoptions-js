import { ValidationError } from '../errors/ValidationError';

/**
 * Result of a validation operation
 */
export class ValidationResult {
  public readonly isValid: boolean;
  public readonly errors: ValidationError[];
  public readonly sanitizedValue: unknown;

  public constructor(isValid: boolean, errors: ValidationError[], sanitizedValue: unknown) {
    this.isValid = isValid;
    this.errors = errors;
    this.sanitizedValue = sanitizedValue;
  }

  /**
   * Create a successful validation result
   */
  public static success(value: unknown): ValidationResult {
    return new ValidationResult(true, [], value);
  }

  /**
   * Create a failed validation result
   */
  public static failure(errors: ValidationError[]): ValidationResult {
    return new ValidationResult(false, errors, undefined);
  }

  /**
   * Create a failed validation result with a single error
   */
  public static error(message: string, field?: string, value?: unknown): ValidationResult {
    return new ValidationResult(false, [new ValidationError(message, field, value)], undefined);
  }
}
