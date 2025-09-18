import { beforeEach, describe, expect, it } from 'bun:test';

import { FieldProcessor } from '../../src/core/FieldProcessor';
// IntFieldDefinition is not exported, using inline type
import { CustomTestError } from '../../src/errors/CustomTestError';
import { ValidationError } from '../../src/errors/ValidationError';

// Concrete implementation for testing
class TestFieldProcessor extends FieldProcessor {
  constructor(definition) {
    super(definition);
  }

  _validateType(value) {
    if (typeof value !== 'string') {
      return new ValidationError('Expected string', this._definition.order?.toString(), value);
    }
    return null;
  }
}

describe('FieldProcessor', () => {
  let processor;

  beforeEach(() => {
    processor = new TestFieldProcessor({
      type: 'string',
      required: true,
      default: 'default value',
    });
  });

  describe('validation', () => {
    it('should validate correct type', () => {
      const result = processor.validate('test string');

      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('test string');
      expect(result.errors).toHaveLength(0);
    });

    it('should reject incorrect type', () => {
      const result = processor.validate(123);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Expected string');
    });

    it('should execute custom test function', () => {
      const testProcessor = new TestFieldProcessor({
        order: 1,
        type: 'string',
        test(value) {
          if (value.length < 5) {
            throw new CustomTestError('String too short');
          }
        },
      });

      const result = testProcessor.validate('hi');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('String too short');
    });

    it('should handle custom test throwing regular error', () => {
      const testProcessor = new TestFieldProcessor({
        order: 1,
        type: 'string',
        test(value) {
          if (value.length < 5) {
            throw new Error('String too short');
          }
        },
      });

      const result = testProcessor.validate('hi');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('String too short');
    });

    it('should handle custom test throwing non-error', () => {
      const testProcessor = new TestFieldProcessor({
        order: 1,
        type: 'string',
        test(value) {
          if (value.length < 5) {
            throw 'String too short';
          }
        },
      });

      const result = testProcessor.validate('hi');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Custom test failed');
    });
  });

  describe('getters', () => {
    it('should return default value', () => {
      expect(processor.getDefaultValue()).toBe('default value');
    });

    it('should return field type', () => {
      expect(processor.getType()).toBe('string');
    });

    it('should return if required', () => {
      expect(processor.isRequired()).toBe(true);
    });

    it('should return field order', () => {
      expect(processor.getOrder()).toBeUndefined();
    });
  });
});
