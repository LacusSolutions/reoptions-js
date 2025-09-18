import { describe, expect, it } from 'bun:test';

import { ValidationError } from '../../src/errors/ValidationError';
import { ValidationResult } from '../../src/types/ValidationResult';

describe('ValidationResult', () => {
  describe('constructor', () => {
    it('should create a successful result', () => {
      const result = new ValidationResult(true, [], 'test value');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedValue).toBe('test value');
    });

    it('should create a failed result', () => {
      const errors = [new ValidationError('Test error')];
      const result = new ValidationResult(false, errors, undefined);

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(errors);
      expect(result.sanitizedValue).toBeUndefined();
    });
  });

  describe('static methods', () => {
    it('should create success result', () => {
      const result = ValidationResult.success('test value');

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.sanitizedValue).toBe('test value');
    });

    it('should create failure result', () => {
      const errors = [new ValidationError('Error 1'), new ValidationError('Error 2')];
      const result = ValidationResult.failure(errors);

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(errors);
      expect(result.sanitizedValue).toBeUndefined();
    });

    it('should create single error result', () => {
      const result = ValidationResult.error('Test error', 'field1', 'test value');

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toBe('Test error');
      expect(result.errors[0].field).toBe('field1');
      expect(result.errors[0].value).toBe('test value');
    });
  });
});
