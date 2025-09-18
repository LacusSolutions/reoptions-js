import { describe, expect, it } from 'bun:test';

import { ValidationError } from '../../src/errors/ValidationError';

describe('ValidationError', () => {
  describe('constructor', () => {
    it('should create error with message only', () => {
      const error = new ValidationError('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ValidationError');
      expect(error.field).toBeUndefined();
      expect(error.value).toBeUndefined();
    });

    it('should create error with field and value', () => {
      const error = new ValidationError('Test error', 'field1', 'test value');

      expect(error.message).toBe('Test error');
      expect(error.field).toBe('field1');
      expect(error.value).toBe('test value');
    });
  });

  describe('static methods', () => {
    it('should create field-specific error', () => {
      const error = ValidationError.forField('field1', 'Invalid value', 'test');

      expect(error.message).toBe('Field "field1": Invalid value');
      expect(error.field).toBe('field1');
      expect(error.value).toBe('test');
    });

    it('should create type mismatch error', () => {
      const error = ValidationError.typeMismatch('field1', 'string', 123);

      expect(error.message).toBe('Field "field1": Expected string, got number');
      expect(error.field).toBe('field1');
      expect(error.value).toBe(123);
    });
  });
});
