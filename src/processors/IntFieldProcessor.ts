import { FieldProcessor } from '../core/FieldProcessor';
import { ValidationError } from '../errors/ValidationError';
import { type IntFieldDefinition } from '../types/FieldDefinition';
import { ValidationResult } from '../types/ValidationResult';

/**
 * Processor for integer field validation with rounding support
 */
export class IntFieldProcessor extends FieldProcessor {
  protected _definition: IntFieldDefinition;

  public constructor(definition: IntFieldDefinition) {
    super(definition);
    this._definition = definition;
  }

  /**
   * Validate and process an integer value
   */
  public validate(value: unknown): ValidationResult {
    const errors: ValidationError[] = [];

    // Apply rounding if specified
    let processedValue = value;
    if (this._definition.round) {
      processedValue = this._applyRounding(value, this._definition.round);
    }

    // Type validation
    const typeError = this._validateType(processedValue);
    if (typeError) {
      errors.push(typeError);
    }

    // Custom test (only if type validation passed)
    if (errors.length === 0 && this._definition.test) {
      try {
        this._definition.test(processedValue as number);
      } catch (error) {
        if (error instanceof Error) {
          errors.push(
            new ValidationError(error.message, this._definition.order?.toString(), processedValue),
          );
        } else {
          errors.push(
            new ValidationError(
              'Custom test failed',
              this._definition.order?.toString(),
              processedValue,
            ),
          );
        }
      }
    }

    return new ValidationResult(errors.length === 0, errors, processedValue);
  }

  /**
   * Validate that the value is an integer
   */
  protected _validateType(value: unknown): null | ValidationError {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return ValidationError.typeMismatch(
        this._definition.order?.toString() ?? 'field',
        'integer',
        value,
      );
    }
    return null;
  }

  /**
   * Apply rounding to the value based on the round option
   */
  private _applyRounding(value: unknown, round: 'ceiling' | 'floor' | boolean): unknown {
    if (typeof value !== 'number' || isNaN(value)) {
      return value;
    }

    if (round === true) {
      return Math.round(value);
    } else if (round === 'floor') {
      return Math.floor(value);
    } else if (round === 'ceiling') {
      return Math.ceil(value);
    }

    return value;
  }
}
