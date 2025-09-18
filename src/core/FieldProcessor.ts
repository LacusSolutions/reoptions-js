import { CustomTestError } from '../errors/CustomTestError';
import { ValidationError } from '../errors/ValidationError';
import { type FieldDefinition } from '../types/FieldDefinition';
import { ValidationResult } from '../types/ValidationResult';

/**
 * Abstract base class for field processors
 */
export abstract class FieldProcessor {
  protected _definition: FieldDefinition;

  public constructor(definition: FieldDefinition) {
    this._definition = definition;
  }

  /**
   * Validate a value against the field definition
   */
  public validate(value: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    // 1. Type validation
    const typeError = this._validateType(value);
    if (typeError) {
      errors.push(typeError);
    }

    // 2. Custom test (only if type validation passed)
    if (errors.length === 0 && this._definition.test) {
      try {
        (this._definition.test as (value: unknown) => void)(value);
      } catch (error) {
        if (error instanceof CustomTestError) {
          errors.push(new ValidationError(error.message, error.field, error.value));
        } else if (error instanceof Error) {
          errors.push(
            new ValidationError(error.message, this._definition.order?.toString(), value),
          );
        } else {
          errors.push(
            new ValidationError('Custom test failed', this._definition.order?.toString(), value),
          );
        }
      }
    }

    return new ValidationResult(errors.length === 0, errors, value);
  }

  /**
   * Get the default value for this field
   */
  public getDefaultValue(): unknown {
    return this._definition.default;
  }

  /**
   * Get the field type
   */
  public getType(): string {
    return this._definition.type;
  }

  /**
   * Check if the field is required
   */
  public isRequired(): boolean {
    return this._definition.required === true;
  }

  /**
   * Get the field order
   */
  public getOrder(): number | undefined {
    return this._definition.order;
  }

  /**
   * Abstract method to validate the type of a value
   */
  protected abstract _validateType(value: unknown): null | ValidationError;
}
