import { beforeEach, describe, expect, it } from 'bun:test';

import { OptionsSchema } from '../../src/core/OptionsSchema';

describe('OptionsSchema', () => {
  describe('schema creation', () => {
    it('should create schema from definition', () => {
      const schema = OptionsSchema.create({
        field1: {
          type: 'int',
          required: true,
        },
        field2: {
          type: 'int',
          required: false,
          default: 42,
        },
      });

      expect(schema).toBeInstanceOf(OptionsSchema);
      expect(schema.getFieldNames()).toEqual(['field1', 'field2']);
    });

    it('should sort fields by order', () => {
      const schema = OptionsSchema.create({
        field3: {
          order: 3,
          type: 'int',
          required: true,
        },
        field1: {
          order: 1,
          type: 'int',
          required: true,
        },
        field2: {
          order: 2,
          type: 'int',
          required: true,
        },
      });

      expect(schema.getFieldNames()).toEqual(['field1', 'field2', 'field3']);
    });
  });

  describe('validation', () => {
    let schema;

    beforeEach(() => {
      schema = OptionsSchema.create({
        requiredField: {
          order: 1,
          type: 'int',
          required: true,
        },
        optionalField: {
          order: 2,
          type: 'int',
          required: false,
          default: 42,
        },
        roundedField: {
          order: 3,
          type: 'int',
          required: false,
          default: 0,
          round: 'floor',
        },
      });
    });

    it('should validate complete input', () => {
      const result = schema.validate({
        requiredField: 10,
        optionalField: 20,
        roundedField: 15.7,
      });

      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toEqual({
        requiredField: 10,
        optionalField: 20,
        roundedField: 15,
      });
    });

    it('should use default values for missing optional fields', () => {
      const result = schema.validate({
        requiredField: 10,
      });

      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toEqual({
        requiredField: 10,
        optionalField: 42,
        roundedField: 0,
      });
    });

    it('should fail when required field is missing', () => {
      const result = schema.validate({
        optionalField: 20,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('requiredField');
      expect(result.errors[0].message).toContain('required');
    });

    it('should fail when field has wrong type', () => {
      const result = schema.validate({
        requiredField: 'not a number',
        optionalField: 20,
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('requiredField');
      expect(result.errors[0].message).toContain('Expected integer');
    });

    it('should handle multiple validation errors', () => {
      const result = schema.validate({
        requiredField: 'not a number',
        optionalField: 'also not a number',
      });

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
    });
  });

  describe('getDefaults', () => {
    it('should return default values for optional fields', () => {
      const schema = OptionsSchema.create({
        requiredField: {
          order: 1,
          type: 'int',
          required: true,
        },
        optionalField1: {
          order: 2,
          type: 'int',
          required: false,
          default: 42,
        },
        optionalField2: {
          order: 3,
          type: 'int',
          required: false,
          default: 100,
        },
      });

      const defaults = schema.getDefaults();
      expect(defaults).toEqual({
        optionalField1: 42,
        optionalField2: 100,
      });
    });

    it('should return empty object when no optional fields', () => {
      const schema = OptionsSchema.create({
        requiredField: {
          order: 1,
          type: 'int',
          required: true,
        },
      });

      const defaults = schema.getDefaults();
      expect(defaults).toEqual({});
    });
  });

  describe('getFieldDefinition', () => {
    it('should return field definition by name', () => {
      const schema = OptionsSchema.create({
        testField: {
          type: 'int',
          required: true,
        },
      });

      const definition = schema.getFieldDefinition('testField');
      expect(definition).toEqual({
        type: 'int',
        required: true,
      });
    });

    it('should return undefined for non-existent field', () => {
      const schema = OptionsSchema.create({
        testField: {
          type: 'int',
          required: true,
        },
      });

      const definition = schema.getFieldDefinition('nonExistent');
      expect(definition).toBeUndefined();
    });
  });

  describe('bail option', () => {
    let schema;

    beforeEach(() => {
      schema = OptionsSchema.create({
        field1: {
          order: 1,
          type: 'int',
          required: true,
        },
        field2: {
          order: 2,
          type: 'int',
          required: true,
        },
        field3: {
          order: 3,
          type: 'int',
          required: false,
          default: 100,
        },
      });
    });

    it('should stop validation on first error when bail=true', () => {
      const result = schema.validate({}, true);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Field "field1" is required');
      expect(result.sanitizedValue).toEqual({});
    });

    it('should continue validation when bail=false (default)', () => {
      const result = schema.validate({}, false);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].message).toContain('Field "field1" is required');
      expect(result.errors[1].message).toContain('Field "field2" is required');
      expect(result.sanitizedValue).toEqual({ field3: 100 });
    });

    it('should stop on first validation error when bail=true', () => {
      const result = schema.validate({ field1: 'invalid', field2: 42 }, true);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected integer');
      expect(result.sanitizedValue).toEqual({});
    });

    it('should continue validation when bail=false with validation errors', () => {
      const result = schema.validate({ field1: 'invalid', field2: 'also invalid' }, false);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].message).toContain('Expected integer');
      expect(result.errors[1].message).toContain('Expected integer');
      expect(result.sanitizedValue).toEqual({ field3: 100 });
    });

    it('should return success when bail=true and no errors', () => {
      const result = schema.validate({ field1: 10, field2: 20 }, true);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedValue).toEqual({ field1: 10, field2: 20, field3: 100 });
    });

    it('should handle missing optional fields when bail=true', () => {
      const result = schema.validate({ field1: 10, field2: 20 }, true);

      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toEqual({ field1: 10, field2: 20, field3: 100 });
    });

    it('should stop on required field error before processing optional fields', () => {
      const result = schema.validate({ field3: 999 }, true);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Field "field1" is required');
      expect(result.sanitizedValue).toEqual({});
    });

    it('should work with unordered fields when bail=true', () => {
      const unorderedSchema = OptionsSchema.create({
        fieldA: {
          type: 'int',
          required: true,
        },
        fieldB: {
          type: 'int',
          required: true,
        },
        fieldC: {
          type: 'int',
          required: false,
          default: 50,
        },
      });

      const result = unorderedSchema.validate({}, true);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Field "fieldA" is required');
      expect(result.sanitizedValue).toEqual({});
    });

    it('should process fields in order when bail=true', () => {
      const orderedSchema = OptionsSchema.create({
        fieldZ: {
          order: 3,
          type: 'int',
          required: true,
        },
        fieldA: {
          order: 1,
          type: 'int',
          required: true,
        },
        fieldB: {
          order: 2,
          type: 'int',
          required: true,
        },
      });

      const result = orderedSchema.validate({}, true);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Field "fieldA" is required');
      expect(result.sanitizedValue).toEqual({});
    });
  });

  describe('error handling', () => {
    it('should throw error for unsupported field type', () => {
      expect(() => {
        OptionsSchema.create({
          unsupportedField: {
            type: 'unsupported',
          },
        });
      }).toThrow('Unsupported field type: unsupported');
    });

    it('should throw error when required=true and default are both provided', () => {
      expect(() => {
        OptionsSchema.create({
          invalidField: {
            type: 'int',
            required: true,
            default: 42,
          },
        });
      }).toThrow("Cannot specify both 'required: true' and 'default' value");
    });

    it('should allow required=false with default value', () => {
      expect(() => {
        OptionsSchema.create({
          validField: {
            type: 'int',
            required: false,
            default: 42,
          },
        });
      }).not.toThrow();
    });

    it('should allow required=true without default value', () => {
      expect(() => {
        OptionsSchema.create({
          validField: {
            type: 'int',
            required: true,
          },
        });
      }).not.toThrow();
    });
  });
});
