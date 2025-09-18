import { FieldError } from '../errors/FieldError';
import { ValidationError } from '../errors/ValidationError';
import { IntFieldProcessor } from '../processors/IntFieldProcessor';
import {
  type FieldDefinition,
  type IntFieldDefinition,
  type SchemaDefinition,
} from '../types/FieldDefinition';
import { ValidationResult } from '../types/ValidationResult';
import { type FieldProcessor } from './FieldProcessor';

/**
 * Main schema class for validating function arguments
 */
export class OptionsSchema {
  private _fields = new Map<string, FieldProcessor>();
  private _fieldOrder: string[] = [];

  /**
   * Create a new schema from a definition object
   */
  public static create(definition: SchemaDefinition): OptionsSchema {
    const schema = new OptionsSchema();
    schema._buildFromDefinition(definition);
    return schema;
  }

  /**
   * Validate input against the schema
   */
  public validate(input: Record<string, unknown>, bail = false): ValidationResult {
    const errors: ValidationError[] = [];
    const sanitizedValue: Record<string, unknown> = {};

    // Process fields in order
    for (const fieldName of this._fieldOrder) {
      const processor = this._fields.get(fieldName);
      if (!processor) continue;

      const inputValue = input[fieldName];
      const hasValue = inputValue !== undefined;

      // Check if required field is missing
      if (processor.isRequired() && !hasValue) {
        errors.push(FieldError.required(fieldName));
        if (bail) {
          return new ValidationResult(false, errors, sanitizedValue);
        }
        continue;
      }

      // Use default value if field is missing and not required
      if (!hasValue && !processor.isRequired()) {
        sanitizedValue[fieldName] = processor.getDefaultValue();
        continue;
      }

      // Validate the value
      const result = processor.validate(inputValue);
      if (!result.isValid) {
        errors.push(
          ...result.errors.map(
            (error) => new ValidationError(error.message, fieldName, error.value),
          ),
        );
        if (bail) {
          return new ValidationResult(false, errors, sanitizedValue);
        }
        continue;
      }

      sanitizedValue[fieldName] = result.sanitizedValue;
    }

    return new ValidationResult(errors.length === 0, errors, sanitizedValue);
  }

  /**
   * Get default values for all fields
   */
  public getDefaults(): Record<string, unknown> {
    const defaults: Record<string, unknown> = {};

    for (const [fieldName, processor] of Array.from(this._fields.entries())) {
      if (!processor.isRequired()) {
        defaults[fieldName] = processor.getDefaultValue();
      }
    }

    return defaults;
  }

  /**
   * Get all field names
   */
  public getFieldNames(): string[] {
    return [...this._fieldOrder];
  }

  /**
   * Get field definition by name
   */
  public getFieldDefinition(name: string): FieldDefinition | undefined {
    const processor = this._fields.get(name);
    return processor
      ? (processor as unknown as { _definition: FieldDefinition })._definition
      : undefined;
  }

  /**
   * Build the schema from definition object
   */
  private _buildFromDefinition(definition: SchemaDefinition): void {
    // Validate field definitions first
    this._validateFieldDefinitions(definition);

    // Sort fields by order (fields without order go to the end)
    const sortedFields = Object.entries(definition).sort(([, a], [, b]) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    for (const [fieldName, fieldDef] of sortedFields) {
      this._fieldOrder.push(fieldName);
      this._fields.set(fieldName, this._createProcessor(fieldDef));
    }
  }

  /**
   * Validate field definitions for mutual exclusivity rules
   */
  private _validateFieldDefinitions(definition: SchemaDefinition): void {
    for (const [fieldName, fieldDef] of Object.entries(definition)) {
      // Check mutual exclusivity: required and default cannot both be provided
      if (fieldDef.required === true && fieldDef.default !== undefined) {
        throw new Error(
          `Field "${fieldName}": Cannot specify both 'required: true' and 'default' value. ` +
            'Required fields cannot have default values, and fields with default values are optional.',
        );
      }
    }
  }

  /**
   * Create appropriate processor for field definition
   */
  private _createProcessor(definition: FieldDefinition): FieldProcessor {
    switch (definition.type) {
      case 'int':
        return new IntFieldProcessor(definition as IntFieldDefinition);
      // TODO: Add other processors in future phases
      default:
        throw new Error(`Unsupported field type: ${definition.type}`);
    }
  }
}
