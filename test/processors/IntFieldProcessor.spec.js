import { describe, expect, it } from 'bun:test';

import { CustomTestError } from '../../src/errors/CustomTestError';
import { IntFieldProcessor } from '../../src/processors/IntFieldProcessor';
// IntFieldDefinition is not exported, using inline type

describe('IntFieldProcessor', () => {
  describe('validation', () => {
    it('should validate integer values', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        required: true,
      });

      const result = processor.validate(42);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(42);
    });

    it('should reject non-integer values', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        required: true,
      });

      const result = processor.validate(42.5);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected integer');
    });

    it('should reject non-number values', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        required: true,
      });

      const result = processor.validate('not a number');
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Expected integer');
    });
  });

  describe('rounding', () => {
    it('should round values when round is true', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        round: true,
      });

      const result = processor.validate(42.7);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(43);
    });

    it('should floor values when round is floor', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        round: 'floor',
      });

      const result = processor.validate(42.9);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(42);
    });

    it('should ceiling values when round is ceiling', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        round: 'ceiling',
      });

      const result = processor.validate(42.1);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(43);
    });

    it('should handle negative numbers with floor', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        round: 'floor',
      });

      const result = processor.validate(-42.1);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(-43);
    });

    it('should handle negative numbers with ceiling', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        round: 'ceiling',
      });

      const result = processor.validate(-42.9);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(-42);
    });

    it('should not round when round is not specified', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
      });

      const result = processor.validate(42.7);
      expect(result.isValid).toBe(false); // Should fail because 42.7 is not an integer
    });
  });

  describe('custom test', () => {
    it('should execute custom test function', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        test(value) {
          if (value < 0) {
            throw new CustomTestError('Value must be positive');
          }
        },
      });

      const result = processor.validate(-5);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe('Value must be positive');
    });

    it('should execute custom test after rounding', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        round: 'floor',
        test(value) {
          if (value < 0) {
            throw new CustomTestError('Value must be positive');
          }
        },
      });

      const result = processor.validate(-0.5); // Should become -1 after floor
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe('Value must be positive');
    });

    it('should pass validation when custom test passes', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
        test(value) {
          if (value < 0) {
            throw new CustomTestError('Value must be positive');
          }
        },
      });

      const result = processor.validate(5);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('should handle NaN values', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
      });

      const result = processor.validate(NaN);
      expect(result.isValid).toBe(false);
    });

    it('should handle Infinity values', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
      });

      const result = processor.validate(Infinity);
      expect(result.isValid).toBe(false);
    });

    it('should handle zero', () => {
      const processor = new IntFieldProcessor({
        type: 'int',
      });

      const result = processor.validate(0);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe(0);
    });
  });
});
